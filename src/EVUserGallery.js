// https://www.edmunds.com/inventory/srp.html?inventorytype=used%2Ccpo&type=Electric&sort=price%3Aasc

// https://sfbay.craigslist.org/search/cta?sort=priceasc&auto_fuel_type=4
// https://www.autotrader.com/cars-for-sale/Used+Cars/San+Francisco+CA-94117?startYear=1981&listingTypes=USED&searchRadius=50&zip=94117&endYear=2020&marketExtension=true&engineCodes=EL&sortBy=derivedpriceASC&numRecords=100&firstRecord=0
// https://www.cars.com/for-sale/searchresults.action/?fuelTypeId=38745&page=1&perPage=20&rd=30&searchSource=SORT&shippable-dealers-checkbox=true&showMore=false&sort=price-lowest&stkTypId=28881&zc=94117&localVehicles=false

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, Linking, FlatList, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';

export default class OtherScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      used: false,
      data: null,
      images: null,
      loading: false,
       };

    this._getUsedData = this._getUsedData.bind(this)
    this._getNewData = this._getNewData.bind(this)

  }


  componentDidMount() {
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        {this.state.email ? Mixpanel.identify(this.state.email) : null }
        if(this.state.email !== 'niko'){Mixpanel.track("PriceScreenUsed Loaded") }
        // if(this.state.email === 'niko'){ AsyncStorage.removeItem('remainingtrials') }
      })

      this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
          AsyncStorage.getItem('used').then((res) => {
            this.setState({used: (res === 'true')})
            res === 'true' ? this._getUsedData() : this._getNewData()
          })     
        }
      );
  }


  _getUsedData(){

    this.setState({loading: true})
    
    // GET SCRAPED RESULTS
    fetch('https://api.apify.com/v1/rG44NsjnfukCkKecE/crawlers/ssxDRduoSE3XdkzLv/lastExec/results?token=vDBYC8EeGdBZpYPrrrXLEjmwF')
      .then((res) => { return res.json()})
      
      // merge arrays from different sites
      .then(res =>  {   let finalArray = []
                         for (i = 0; i < res.length; i++){
                                if (i === 0) { finalArray = res[0].pageFunctionResult; }
                                else { finalArray = finalArray.concat( res[i].pageFunctionResult ); }
                              } 
                         return finalArray
                      })

      // deduplicate
      .then((res) => {
                  res = res.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                       t.name === thing.name
                    ))
                  )
                  return res
      })

      // sort
      .then(res => {  
                let newArray = res; for (i = 0; i < res.length; i++){ newArray[i].price = parseInt(newArray[i].price.replace(',', '').replace('$', '')) }; 
                return newArray.sort((a, b) => a.price - b.price)  })

      // set results as state
      .then((res) => {
                  this.setState({data: res}); 
                  console.log(res)
      })

      .then(() => {
          // GET OWN LISTINGS
          fetch('https://electrade-server.herokuapp.com/api/listings/get/'+'used')
            .then((res) => res.json())
            .then((json) => { this.setState({data: json.concat(this.state.data), loading: false}); console.log(json) })
      })
      

    
  }

  _getNewData(){
    this.setState({loading: true})
    fetch('https://api.apify.com/v1/rG44NsjnfukCkKecE/crawlers/dqChEgEi92GTiNG9a/lastExec/results?token=p7r3cZrnv5BnGn9c4kC7PpcPT')
      .then((res) => { return res.json()})
      
      // merge arrays from different sites
      .then(res =>  {   let finalArray = []
                         for (var i = 0; i < res.length; i++){
                                if (i === 0) { finalArray = res[0].pageFunctionResult; }
                                else { finalArray = finalArray.concat( res[i].pageFunctionResult ); }
                              } 
                         return finalArray
                      })

      // add to URL and $
      .then(res => {  
                let newArray = res; 
                for (var i = 0; i < res.length; i++){ 
                        newArray[i].price = parseInt(newArray[i].price.replace(',', '').replace('$', ''));
                        newArray[i].link = "https://www.edmunds.com"+newArray[i].link;
                }; 
                return newArray
              }
      )

      // add teslas
      .then((res) => { res.push(
                          { name: 'NEW Tesla Model 3', price: '42900', image: 'https://www.tesla.com/tesla_theme/assets/img/model3/hero-img--touch.jpg?20170801', link: 'https://3.tesla.com/model3/design#battery'},
                          { name: 'NEW Tesla Model S', price: '85000', image: 'https://i0.wp.com/eastwest.thegadgetman.org.uk/wp-content/uploads/2017/07/tesla256.png?fit=256%2C256&ssl=1', link: 'https://www.tesla.com/modelx/design#battery'},
                          { name: 'NEW Tesla Model X', price: '88000', image: 'https://pbs.twimg.com/profile_images/713511184910139392/_hAw3t46_400x400.jpg', link: 'https://www.tesla.com/models/design#battery'}
                          ) 
                      return res
                    })

      // deduplicate
      .then((res) => {
                  res = res.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                       t.name === thing.name
                  )))
                  return res
      })

      // sort
      .then(res => {  
                return res.sort((a, b) => a.price - b.price)  })

      // set results as state
      .then((res) => {
                  this.setState({data: res}); 
                  // console.log(res)
      })

      .then(() => {
          // GET OWN LISTINGS
          fetch('https://electrade-server.herokuapp.com/api/listings/get/'+'new')
            .then((res) => res.json())
            .then((json) => { this.setState({data: json.concat(this.state.data), loading: false}); console.log(json) })
      })
  }


  _onSwitchUsed(value){
    console.log(value)
    this.setState({used: value})
    AsyncStorage.setItem('used', JSON.stringify(value))
    // if(this.state.email !== 'niko'){ Mixpanel.track("Switched Abbreviation to "+this.state.abbreviated); }
    this.state.used === true ? this._getNewData() : this._getUsedData()
  }


  render() {
    return (
       <View>
        <View style={{maxHeight: '100%'}}>
          <View style={{marginTop: 40, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between'}} zIndex={5}>
              <TouchableOpacity style={{alignItems: 'space-between'}}
                                onPress={() => this.props.navigation.navigate('Submit', {listingType: this.state.used === true ? 'used' : 'new'} )} 
                                delayPressIn={50} >
                <View style={{display: 'flex', flexDirection:'row', padding: 5}}>
                  <Icon name="ios-add-circle" size={24}  color="#4F8EF7" />
                  <Text style={{color: "#4F8EF7", fontSize: 20, fontWeight: '800'}}>Add a {this.state.used === true ? 'used' : 'new'} EV</Text>
                </View>
              </TouchableOpacity>
              <View style={{display: 'flex', flexDirection:'row', padding: 5}}>
                <Text style={{margin: 5, fontWeight: '400'}}>Show Used</Text>
                <Switch 
                    value={this.state.used} 
                    onValueChange={(value) => this._onSwitchUsed(value)} 
                    />
              </View>
            </View>
          {!this.state.loading ?
            <Animatable.View animation="slideInUp" duration={500} easing="ease-out-back">
              <FlatList
                     data={this.state.data}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({item, index}) => 
                        <View style={{ marginBottom: index === this.state.data.length -1 ? 180 : 0}}>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {item: item} ) } delayPressIn={50} >

                            <View style={{display: 'flex', flexDirection:'row'}}>
                              
                              <View style={{flex: 0.4}}>
                                <Image  style={styles.imageCar}
                                        source={{uri: item.image}} 
                                        />
                              </View>

                              <View style={{flex: 0.6, marginLeft: 5}}>
                                <Text style={styles.newsTitle}>${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</Text>
                                <Text >{item.name.replace('USED', '').replace('NEW', '')}</Text>
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
        </View>
      </View>
    );



  }
}

