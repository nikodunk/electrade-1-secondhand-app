// https://www.edmunds.com/inventory/srp.html?inventorytype=used%2Ccpo&type=Electric&sort=price%3Aasc

// https://sfbay.craigslist.org/search/cta?sort=priceasc&auto_fuel_type=4
// https://www.autotrader.com/cars-for-sale/Used+Cars/San+Francisco+CA-94117?startYear=1981&listingTypes=USED&searchRadius=50&zip=94117&endYear=2020&marketExtension=true&engineCodes=EL&sortBy=derivedpriceASC&numRecords=100&firstRecord=0
// https://www.cars.com/for-sale/searchresults.action/?fuelTypeId=38745&page=1&perPage=20&rd=30&searchSource=SORT&shippable-dealers-checkbox=true&showMore=false&sort=price-lowest&stkTypId=28881&zc=94117&localVehicles=false

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, Linking, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';

export default class OtherScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      images: null,
      loading: false,
       };

    this._getData = this._getData.bind(this)

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
          this._getData()
        }
      );
  }


  _getData(){

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


  render() {
    return (
       <View>
       {!this.state.loading ?
        <View style={{maxHeight: '100%'}}>
          <View style={{marginTop: 40, backgroundColor: 'white'}} zIndex={5}>
            <TouchableOpacity style={{alignItems: 'center'}}
                              onPress={() => this.props.navigation.navigate('Submit', {listingType: 'used'})} >
              <View style={{display: 'flex', flexDirection:'row', padding: 5}}>
                <Icon name="ios-add-circle" size={24}  color="#4F8EF7" />
                <Text style={{color: "#4F8EF7", fontSize: 20, fontWeight: '800'}}> List a used EV</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>
          
          <Animatable.View animation="slideInUp" duration={500} easing="ease-out-back">
            <FlatList
                   data={this.state.data}
                   keyExtractor={(item, index) => index.toString()}
                   renderItem={({item, index}) => 
                      <View style={{ marginBottom: index === this.state.data.length -1 ? 80 : 0}}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {item: item} ) } delayPressIn={50} >

                          <View style={{display: 'flex', flexDirection:'row'}}>
                            
                            <View style={{flex: 0.4}}>
                              <Image  style={styles.imageCar}
                                      source={{uri: item.image}} 
                                      />
                            </View>

                            <View style={{flex: 0.6, marginLeft: 5}}>
                              <Text style={styles.newsTitle}>${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</Text>
                              <Text >{item.name.replace('USED', '')}</Text>
                            </View>
                            
                          </View>
                        </TouchableOpacity>
                        
                        <View style={styles.separator} />

                      </View>
                    }
                 />
          </Animatable.View>
        </View>
        :
        <View style={{marginTop: 100, alignItems: 'center'}}>
          <Text style={{color: 'grey'}}>Getting updated prices... </Text>
          <ActivityIndicator />
        </View>
        }
      </View>
    );



  }
}

