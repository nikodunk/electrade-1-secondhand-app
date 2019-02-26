// *
// price leaderboard
// *

// New EV Price Search (leaf, bolt, kona) edmunds
// https://www.edmunds.com/inventory/srp.html?fueltype=electric&inventorytype=new&sort=price%3Aasc
// https://api.apify.com/v1/rG44NsjnfukCkKecE/crawlers/dqChEgEi92GTiNG9a/lastExec/results?token=p7r3cZrnv5BnGn9c4kC7PpcPT



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
      loading: false
       };

    this._getData = this._getData.bind(this)
  }


  componentDidMount() {
      Mixpanel.track("PriceScreenNew Loaded") 
      this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
          this._getData()
        }
      );
    }


  _getData(){
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


  render() {
    return (
       <View>
       {!this.state.loading ?
          <View style={{maxHeight: '100%'}}>
            <View style={{marginTop: 40}}>
              <TouchableOpacity style={{alignItems: 'center'}}
                                onPress={() => this.props.navigation.navigate('Submit', {listingType: 'new'} )} >
                <View style={{display: 'flex', flexDirection:'row', padding: 5}}>
                  <Icon name="ios-add-circle" size={24}  color="#4F8EF7" />
                  <Text style={{color: "#4F8EF7", fontSize: 20, fontWeight: '800'}}> List a new EV</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.separator} />
            </View>

            <FlatList
                     data={this.state.data}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({item, index}) => 
                        <View style={{ marginBottom: index === this.state.data.length -1 ? 80 : 0}}>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {item: item} ) }>

                            <View style={{display: 'flex', flexDirection:'row'}}>
                              
                              <View style={{flex: 0.4}}>
                                <Image  style={styles.imageCar}
                                        source={{uri: item.image}} 
                                        />
                              </View>

                              <View style={{flex: 0.6, marginLeft: 5}}>
                                <Text style={styles.newsTitle}>${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</Text>
                                <Text >{item.name.replace('NEW', '')}</Text>
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

