// https://www.edmunds.com/inventory/srp.html?inventorytype=used%2Ccpo&type=Electric&sort=price%3Aasc&radius=500
// https://sfbay.craigslist.org/search/cta?sort=priceasc&auto_fuel_type=4
// https://www.autotrader.com/cars-for-sale/Used+Cars/San+Francisco+CA-94117?startYear=1981&listingTypes=USED&searchRadius=50&zip=94117&endYear=2020&marketExtension=true&engineCodes=EL&sortBy=derivedpriceASC&numRecords=100&firstRecord=0
// https://www.cars.com/for-sale/searchresults.action/?fuelTypeId=38745&page=1&perPage=20&rd=30&searchSource=SORT&shippable-dealers-checkbox=true&showMore=false&sort=price-lowest&stkTypId=28881&zc=94117&localVehicles=false


// https://www.myev.com/cars-for-sale?make=tesla&model=model-3
// https://www.tesla.com/inventory/used/ms?arrangeby=plh&zip=94122&range=0



import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, Linking, FlatList, TouchableOpacity, ActivityIndicator, SegmentedControlIOS } from 'react-native';
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
      listingType: 0,
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
          AsyncStorage.getItem('listingtype').then((res) => {
            console.log('listingtype from asyncstorage: ', JSON.parse(res))
            res !== null ? this.setState({listingType: JSON.parse(res) }) : null
            this.state.listingType === 0 ? this._getUsedTeslaData() : null
            this.state.listingType === 1 ? this._getUsedData() : null
            this.state.listingType === 2 ? this._getNewData() : null
          })     
        }
      );
  }

  _getUsedTeslaData(){

    this.setState({loading: true})

    // GET SCRAPED TESLA RESULTS
    fetch('https://api.apify.com/v1/rG44NsjnfukCkKecE/crawlers/oZsdPYyHQ97zcaJvB/lastExec/results?token=PCARqhzaNZDF5oB9wxHux344H')
      .then((res) => { return res.json()})
      
      // merge arrays from different pages
      .then(res =>  {   let finalArray = []
                         for (var i = 0; i < res.length; i++){
                                if (i === 0) { res[0].pageFunctionResult.pop(); res[0].pageFunctionResult.shift(); finalArray = res[0].pageFunctionResult; }
                                else { res[i].pageFunctionResult.pop(); res[i].pageFunctionResult.shift(); finalArray = finalArray.concat( res[i].pageFunctionResult ); }
                              } 
                         return finalArray
                      })

      // filter by Tesla
      .then((res) => {
                  var filtered = res.filter(car =>  {return car.name.indexOf('Tesla') !== -1} )
                  return filtered
      })

      // set results as state
      .then((res) => {            
            this.setState({data: res, loading: false});
      })

      // .then(() => {
      //     // GET OWN LISTINGS
      //     fetch('https://electrade-server.herokuapp.com/api/listings/get/'+'used')
      //       .then((res) => res.json())
      //       .then((json) => { this.setState({data: json.concat(this.state.data), loading: false}); console.log('USED CAR DATA:',this.state.data) })
      // })   

  }

  _getUsedData(){

    this.setState({loading: true})

    // GET SCRAPED USED RESULTS
    fetch('https://api.apify.com/v1/rG44NsjnfukCkKecE/crawlers/oZsdPYyHQ97zcaJvB/lastExec/results?token=PCARqhzaNZDF5oB9wxHux344H')
      .then((res) => { return res.json()})
      
      // merge arrays from different pages
      .then(res =>  {   let finalArray = []
                         for (var i = 0; i < res.length; i++){
                                if (i === 0) { res[0].pageFunctionResult.pop(); res[0].pageFunctionResult.shift(); finalArray = res[0].pageFunctionResult; }
                                else { res[i].pageFunctionResult.pop(); res[i].pageFunctionResult.shift(); finalArray = finalArray.concat( res[i].pageFunctionResult ); }
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
      // .then(res => {  
      //           let newArray = res; for (i = 0; i < res.length; i++){ newArray[i].price = parseInt(newArray[i].price.replace(',', '').replace('$', '')) }; 
      //           return newArray.sort((a, b) => a.price - b.price)  })

      // edit properties of car object
      // .then(res => {  
      //           let newArray = res; 
      //           for (var i = 0; i < res.length; i++){ 
      //                   { newArray[i].description ? newArray[i].description = newArray[i].description.substring(0, newArray[i].description.indexOf('.')) : null }
      //                   // newArray[i].name = newArray[i].name.replace('USED', '')
      //           }; 
      //           return newArray
      //         }
      // )

      // set results as state
      .then((res) => {            
            this.setState({data: res});
      })

      .then(() => {
          // GET OWN LISTINGS
          fetch('https://electrade-server.herokuapp.com/api/listings/get/'+'used')
            .then((res) => res.json())
            .then((json) => { this.setState({data: json.concat(this.state.data), loading: false}); console.log('USED CAR DATA:',this.state.data) })
      })      
  }



  _getNewData(){

    // GET SCRAPED NEW RESULTS
    this.setState({loading: true})

    fetch('https://api.apify.com/v1/rG44NsjnfukCkKecE/crawlers/x7MRPs4gC5m92pFqT/lastExec/results?token=P5RuE6cEHFtLd5myHFxFybLym')
      .then((res) => { return res.json()})
      
      // merge arrays from different sites
      .then(res =>  {   let finalArray = []
                         for (var i = 0; i < res.length; i++){
                                if (i === 0) { res[0].pageFunctionResult.pop(); res[0].pageFunctionResult.shift(); finalArray = res[0].pageFunctionResult; }
                                else { res[i].pageFunctionResult.pop(); res[i].pageFunctionResult.shift(); finalArray = finalArray.concat( res[i].pageFunctionResult ); }
                              } 
                         return finalArray
                      })

      // add to URL and $
      .then(res => {  
                let newArray = res; 
                for (var i = 0; i < res.length; i++){ 
                        // newArray[i].offers.price = parseInt(newArray[i].offers.price.replace(',', '').replace('$', ''));
                        // newArray[i].link = "https://www.edmunds.com"+newArray[i].link;
                        // newArray[i].name = newArray[i].name.replace('NEW', '')
                        // { newArray[i].description ? newArray[i].description = newArray[i].description.substring(0, newArray[i].description.indexOf('.')) : null }
                }; 
                return newArray
              }
      )

      // add teslas
      .then((res) => { res.push(
                          { name: 'NEW Tesla Model 3', offers: {price:  '35000' }, image: 'https://www.tesla.com/tesla_theme/assets/img/model3/hero-img--touch.jpg?20170801', url: 'https://3.tesla.com/model3/design#battery'},
                          { name: 'NEW Tesla Model S', offers: {price: '79000' }, image: 'https://i0.wp.com/eastwest.thegadgetman.org.uk/wp-content/uploads/2017/07/tesla256.png?fit=256%2C256&ssl=1', url: 'https://www.tesla.com/modelx/design#battery'},
                          { name: 'NEW Tesla Model X', offers: {price: '88000' }, image: 'https://pbs.twimg.com/profile_images/713511184910139392/_hAw3t46_400x400.jpg', url: 'https://www.tesla.com/models/design#battery'}
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
            .then((json) => { this.setState({data: json.concat(this.state.data), loading: false}); console.log('NEW CAR DATA:',this.state.data) })
      })
  }


  _onSwitchType(event){
    let newIndex = event.nativeEvent.selectedSegmentIndex
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
       <View style={{flex: 1}}>
        <View style={{maxHeight: '100%', flex: 1}}>
          <View style={{marginTop: 40, backgroundColor: 'white', height: 25, margin: 7}} zIndex={5}>
                <SegmentedControlIOS
                  values={['Used Teslas', 'All Used', 'New']}
                  style={{flex: 1}}
                  selectedIndex={this.state.listingType}
                  onChange={(event) => {
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
                                {item.offers.price ? <Text style={styles.newsTitle}>${item.offers.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</Text> : null }
                                <Text> {item.name}</Text>
                                {item.mileageFromOdometer && item.mileageFromOdometer.value ? <Text style={styles.newsSource}>Miles: {item.mileageFromOdometer.value}</Text> : <Text style={styles.newsSource}>New</Text> } 
                                <Text style={styles.newsSource}>{item.description ? item.description.substring(0, item.description.indexOf('.')) : null } </Text>
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
          <Animatable.View animation="bounceIn" duration={500} style={styles.newsItem}>
            <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('Submit', {listingType: this.state.listingType, type: 'Marketplace'} )} >
              <Icon name="ios-camera" size={24}  color="white" />
            </TouchableOpacity>
          </Animatable.View>

        </View>
      </View>
    );



  }
}

