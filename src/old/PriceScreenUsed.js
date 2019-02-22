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
  
  static navigationOptions = {
    title: 'Used',
    tabBarIcon: <Icon name="ios-heart" size={22} color="#4F8EF7" inactivecolor="black" />
  };

  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      images: null
       };

    this._getData = this._getData.bind(this)

  }


  componentDidMount() {
      this._getData()
      Mixpanel.track("PriceScreenUsed Loaded")
  }


  _getData(){
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
                  // console.log(res)
      })
  }


  render() {
    return (
       <View>
       {this.state.data ?
        <View>
          <View style={{marginTop: 40}}>
            <TouchableOpacity style={{alignItems: 'center'}}
                              onPress={() => Linking.openURL("mailto:hello@sunboxlabs.com")} >
              <View style={{display: 'flex', flexDirection:'row', padding: 5}}>
                <Icon name="ios-add-circle" size={24}  color="#4F8EF7" />
                <Text style={{color: "#4F8EF7", fontSize: 20, fontWeight: '800'}}> Add your EV </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>
          <FlatList
                   data={this.state.data}
                   keyExtractor={(item, index) => index.toString()}
                   renderItem={({item, index}) => 
                      <View>
                        <TouchableOpacity onPress={() => Linking.openURL("https://www.edmunds.com".concat(item.link))}>

                          <View style={{display: 'flex', flexDirection:'row'}}>
                            
                            <View style={{alignItems: 'center', flex: 0.5}}>
                              <Image  style={styles.imageCar}
                                      source={{uri: item.image}} 
                                      />
                            </View>

                            <View style={{flex: 0.5}}>
                              <Text style={styles.newsTitle}>${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</Text>
                              <Text style={{fontWeight: '600'}}>{item.name.replace('USED', '')}</Text>
                            </View>
                            
                          </View>
                        </TouchableOpacity>
                        
                        <View style={styles.separator} />

                      </View>
                    }
                 />
            <TouchableOpacity 
                      style={[styles.newsItem, {right: 10, bottom: '10%', position: 'absolute', padding: 10, alignItems: 'center'}]}
                      onPress={() => Linking.openURL("mailto:hello@sunboxlabs.com")} >
                <Text style={{color: "#4F8EF7", fontSize: 15}} >
                    List a used EV
                </Text>
                <Icon name="ios-add-circle" size={24}  color="#4F8EF7" />
            </TouchableOpacity>
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

