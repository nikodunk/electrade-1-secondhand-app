// *
// price leaderboard
// *

// Used EV Price Search (leaf, bolt, tesla) edmunds
// https://www.edmunds.com/inventory/srp.html?inventorytype=used%2Ccpo&type=Electric&sort=price%3Aasc
// https://api.apify.com/v1/rG44NsjnfukCkKecE/crawlers/ssxDRduoSE3XdkzLv/lastExec/results?token=vDBYC8EeGdBZpYPrrrXLEjmwF

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, Linking, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Mixpanel from 'react-native-mixpanel'


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
      Mixpanel.track("PriceScreenUsed Loaded")
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
        <View>
          <View style={{marginTop: 40}}>
            <TouchableOpacity style={{alignItems: 'center'}}
                              onPress={() => this.props.navigation.navigate('Submit', {listingType: 'used'})} >
              <View style={{display: 'flex', flexDirection:'row', padding: 5}}>
                <Icon name="ios-add-circle" size={24}  color="#4F8EF7" />
                <Text style={{color: "#4F8EF7", fontSize: 20, fontWeight: '800'}}> List a used EV</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>
          

          <FlatList
                   data={this.state.data}
                   keyExtractor={(item, index) => index.toString()}
                   renderItem={({item, index}) => 
                      <View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {item: item} ) }>

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

