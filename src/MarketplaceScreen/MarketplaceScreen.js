import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, Linking, FlatList, TouchableOpacity, ActivityIndicator, SegmentedControlIOS } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { Button } from 'react-native-elements';

export default class OtherScreen extends React.Component {


  constructor(props) {
    super(props);
    
    this.state = { 
      data: null,
      images: null,
      loading: false,
      listingType: 0,
      region: null
      };

    this._getUsedData = this._getUsedData.bind(this)
    this._getNewData = this._getNewData.bind(this)

  }


  componentDidMount() {
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        {this.state.email ? Mixpanel.identify(this.state.email) : null }
        if(this.state.email !== 'niko'){Mixpanel.track("Marketplace Loaded") }
        // if(this.state.email === 'niko'){ AsyncStorage.removeItem('remainingtrials') }
      })

      this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {

          this._getRegion()
          
        }
      );
  }


  _getRegion(){

    AsyncStorage.getItem('region')
    .then((region) => { 
                        // should the region be set as something from the last version or it be first open default to norcal
                        if (region === null || region === '"SF Bay Area"'){
                                    this.setState({region: 'CA(N)', loading: false, regionString: 'Northern California' })
                                    AsyncStorage.setItem('region', JSON.stringify('CA(N)'))
                        }
                        // if it is set to a valid state, then make it pretty.
                        else {      let humanReadableRegion
                                    let regionString = JSON.parse(region)
                                    regionString === 'CA(N)' ? humanReadableRegion = 'Northern California' : null
                                    regionString === 'CA(S)' ? humanReadableRegion = 'Southern California' : null
                                    regionString === 'NY' ? humanReadableRegion = 'New York' : null
                                    regionString === 'CO' ? humanReadableRegion = 'Colorado' : null
                                    regionString === 'FL' ? humanReadableRegion = 'Florida' : null
                                    regionString === 'GA' ? humanReadableRegion = 'Georgia' : null
                                    regionString === 'IL' ? humanReadableRegion = 'Illinois' : null
                                    regionString === 'MA' ? humanReadableRegion = 'Massachusetts' : null
                                    regionString === 'MD' ? humanReadableRegion = 'Maryland' : null
                                    regionString === 'NJ' ? humanReadableRegion = 'New Jersey' : null
                                    regionString === 'OR' ? humanReadableRegion = 'Oregon' : null
                                    regionString === 'VA' ? humanReadableRegion = 'Virginia' : null
                                    regionString === 'WA' ? humanReadableRegion = 'Washington' : null
                                    regionString === 'RI' ? humanReadableRegion = 'Rhode Island' : null
                                    this.setState({region: regionString, loading: false, regionString: humanReadableRegion })
                            }})
    .then(() => this._getData())
}



  _getData(){
    this.state.region === 'CA(N)' ? this.setState({regionShort: 'SF'}) : null
    this.state.region === 'CA(S)' ? this.setState({regionShort: 'LA'}) : null

    AsyncStorage.getItem('listingtype').then((res) => {
      console.log('listingtype from asyncstorage: ', JSON.parse(res))
      res !== null ? this.setState({listingType: JSON.parse(res) }) : null
      this.state.listingType === 0 ? this._getUsedTeslaData() : null
      this.state.listingType === 1 ? this._getUsedData() : null
      this.state.listingType === 2 ? this._getNewData() : null
    })
  }



  _getUsedTeslaData(){

    this.setState({loading: true})


    // GET SCRAPED TESLA RESULTS
    // fetch('http://localhost:8080/api/indexes/get/'+'SF'+'/'+'0')
    fetch('https://electrade-server.herokuapp.com/api/indexes/get/'+this.state.regionShort+'/'+'0')
      .then((res) => { return res.json()})

      // filter by Tesla
      .then((res) => {
                  var filtered = res.filter(car =>  {return car.name.indexOf('Tesla') !== -1} )
                  return filtered
      })

      // filter out remaining 0 prices
      .then((res) => {
        filtered = res.filter(function (item) {
          return item.offers.price !== 0;
        });
        return filtered
      })

      // set results as state
      .then((res) => {            
            this.setState({data: res, loading: false});
      })

      .then(() => {
          // GET OWN LISTINGS
          fetch('https://electrade-server.herokuapp.com/api/listings/get/'+'0')
            .then((res) => res.json())
            .then((json) => { this.setState({data: json.concat(this.state.data), loading: false}); console.log('USED CAR DATA:',this.state.data) })
      })

  }

  _getUsedData(){

    this.setState({loading: true})

    // GET SCRAPED USED RESULTS
    // fetch('http://localhost:8080/api/indexes/get/'+'SF'+'/'+'1')
    fetch('https://electrade-server.herokuapp.com/api/indexes/get/'+this.state.regionShort+'/'+'1')
      .then((res) => { return res.json()})

      // filter out remaining 0 prices
      .then((res) => {
        filtered = res.filter(function (item) {
          return item.offers.price !== 0;
        });
        return filtered
      })
      
      // set results as state
      .then((res) => {            
            this.setState({data: res});
      })

      .then(() => {
          // GET OWN LISTINGS
          fetch('https://electrade-server.herokuapp.com/api/listings/get/'+'1')
            .then((res) => res.json())
            .then((json) => { this.setState({data: json.concat(this.state.data), loading: false}); console.log('USED CAR DATA:',this.state.data) })
      })      
  }



  _getNewData(){

    // GET SCRAPED NEW RESULTS
    this.setState({loading: true})

    // fetch('http://localhost:8080/api/indexes/get/'+'SF'+'/'+'2')
    fetch('https://electrade-server.herokuapp.com/api/indexes/get/'+this.state.regionShort+'/'+'2')
      
      // JSONify
      .then((res) => { return res.json()})
      
      // filter out remaining 0 prices
      .then((res) => {
        filtered = res.filter(function (item) {
          return item.offers.price !== 0;
        });
        return filtered
      })

      // set results as state
      .then((res) => {
                  this.setState({data: res}); 
                  // console.log(res)
      })

      .then(() => {
          // GET OWN LISTINGS
          fetch('https://electrade-server.herokuapp.com/api/listings/get/'+'2')
            .then((res) => res.json())
            .then((json) => { this.setState({data: json.concat(this.state.data), loading: false}); console.log('NEW CAR DATA:',this.state.data) })
      })
  }


  _onSwitchType(event){
    let newIndex = event
    console.log(JSON.stringify(newIndex))
    this.setState({listingType: newIndex});
    AsyncStorage.setItem('listingtype', JSON.stringify(newIndex))
    if(this.state.email !== 'niko'){ Mixpanel.track("Switched Marketplace to "+newIndex); }
    newIndex === 0 ? this._getUsedTeslaData() : null
    newIndex === 1 ? this._getUsedData() : null
    newIndex === 2 ? this._getNewData() : null
  }


  render() {
    return (
       <SafeAreaView style={{flex: 1}}>
        <View style={{maxHeight: '100%', flex: 1}}>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[styles.newsTitle, {fontSize: 20}]}>
                &nbsp; {this.state.region}
              </Text>
              <Button
                type="clear"
                onPress={() => this.props.navigation.navigate('Submit', {listingType: this.state.listingType, type: 'Marketplace'} )}
                title="+ Sell your EV" />
            </View>
            <View style={{ backgroundColor: 'white', height: 30, margin: 5, marginTop: 0, marginBottom: 2}} zIndex={5}>
                 <SegmentedControlTab
                           values={['Buy Used Teslas', 'Buy Used EVs', 'Buy New EVs']}
                           selectedIndex={this.state.listingType}
                           onTabPress={(event) => {
                             this._onSwitchType(event)
                           }}
                         />
            </View>
            
          {!this.state.loading ?
            <Animatable.View animation="slideInUp" duration={500} easing="ease-out-back" style={{flex: 1}}>
              <FlatList
                     data={this.state.data}
                     style={{flex: 1}}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({item, index}) => 
                        <View style={{ marginBottom: index === this.state.data.length -1 ? 80 : 0}}>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {item: item, type: 'Marketplace'} ) } delayPressIn={50} >

                            <View style={{display: 'flex', flexDirection:'row'}}>
                              
                              <View style={{flex: 0.4}}>
                                {item.image ? <Image  style={styles.imageCar}
                                        source={{uri: item.image}} 
                                        /> : null }
                              </View>

                              <View style={{flex: 0.6, marginLeft: 5}}>
                                {item.offers && item.offers.price ? <Text style={styles.newsTitle}>${item.offers.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</Text> : null }
                                <Text> {item.name}</Text>
                                {item.mileageFromOdometer && item.mileageFromOdometer.value ? <Text style={styles.newsSource}>Miles: {item.mileageFromOdometer.value}</Text> : <Text style={styles.newsSource}>New</Text> } 
                                <Text style={styles.newsSource}>{item.description ? item.description.substring(0, item.description.indexOf('.')) : null } </Text>
                                {item.source ? <Text style={{color: 'dodgerblue'}}> {item.source} native</Text> : null }
                              </View>
                              
                            </View>
                          </TouchableOpacity>
                          
                          <View style={styles.separator} />

                        </View>
                      }
                   />
            </Animatable.View>
          :
            <View style={{marginTop: 100, alignItems: 'center'}}>
              <Text style={{color: 'grey'}}>Getting updated prices... </Text>
              <ActivityIndicator />
            </View>
          }

          {/*<Animatable.View animation="bounceIn" duration={500} style={styles.newsItem}>
            <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('Submit', {listingType: this.state.listingType, type: 'Marketplace'} )} >
              <Icon name="ios-camera" size={24}  color="white" />
            </TouchableOpacity>
          </Animatable.View>*/}

        </View>
      </SafeAreaView>
    );



  }
}

