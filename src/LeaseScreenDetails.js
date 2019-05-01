import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking, TextInput } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Mixpanel from 'react-native-mixpanel'
import styles from './styles'
import { Button } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import firebase from 'react-native-firebase';

import FeedbackComponent from './components/FeedbackComponent'


const model3Image = require('./img/model3.jpg')
const boltImage = require('./img/bolt.jpg')
const leafImage = require('./img/leaf.jpg')
const konaImage = require('./img/kona.jpg')
const i3Image = require('./img/i3.jpg')
const fiatImage = require('./img/fiat.jpg')
const golfImage = require('./img/golf.jpg')
const bmwImage = require('./img/bmw330e.jpg')
const primeImage = require('./img/prime.jpg')
const voltImage = require('./img/volt.jpg')
const niroImage = require('./img/niro.jpg')



const boltImage1 = require('./img/1/bolt.jpg')
const leafImage1 = require('./img/1/leaf.jpg')
const konaImage1 = require('./img/1/kona.jpg')
const i3Image1 = require('./img/1/i3.jpg')
const fiatImage1 = require('./img/1/fiat.jpg')
const golfImage1 = require('./img/1/golf.jpg')
const primeImage1 = require('./img/1/prime.jpg')
const voltImage1 = require('./img/1/volt.jpg')



const boltImage2 = require('./img/2/bolt.jpg')
const leafImage2 = require('./img/2/leaf.jpg')
const konaImage2 = require('./img/2/kona.jpg')
const i3Image2 = require('./img/2/i3.jpg')
const fiatImage2 = require('./img/2/fiat.jpg')
const golfImage2 = require('./img/2/golf.jpg')
const primeImage2 = require('./img/2/prime.jpg')
const voltImage2 = require('./img/2/volt.jpg')



const boltImage3 = require('./img/3/bolt.jpg')
const leafImage3 = require('./img/3/leaf.jpg')
const konaImage3 = require('./img/3/kona.jpg')
const i3Image3 = require('./img/3/i3.jpg')
const fiatImage3 = require('./img/3/fiat.jpg')
const golfImage3 = require('./img/3/golf.jpg')
const primeImage3 = require('./img/3/prime.jpg')
const voltImage3 = require('./img/3/volt.jpg')





export default class DetailScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state = { 
      type: null,
      item: null,
      region: null
       };
  }



  componentDidMount() {
      this.setState({item: this.props.navigation.getParam('item') })
      this.setState({type: this.props.navigation.getParam('type') })
      this.setState({region: this.props.navigation.getParam('region') })
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email !== 'niko'){
          Mixpanel.track(this.state.type+"Details Loaded",{"Car": this.state.item["Make and Model"]});
          firebase.analytics().logEvent(this.state.type+'DetailsScreen_Loaded')
        }
      })

      

      AsyncStorage.getItem(this.props.navigation.getParam('item')["Make and Model"]).then((res) => {
      if (res) {
        this.setState({left: JSON.parse(res)})
       }
       else
        { let randomNumber = Math.floor(Math.random() * 3) + 1;
          AsyncStorage.setItem(this.state.item["Make and Model"], JSON.stringify(randomNumber));
          this.setState({left: randomNumber}) 
        }
      })
      
  }

  numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

 

  render() {
    return (
       <View style={{flex: 1}}>

        <TouchableOpacity 
              onPress={() => this.props.navigation.goBack()} 
              style={{left: 10, marginTop: 30}}>
          <View style={{padding: 5}}>
            <Text style={{fontSize: 18, color: 'dodgerblue'}}>
                Back
            </Text>
          </View>
        </TouchableOpacity>

        {this.state.item ?
          <ScrollView>

                { this.state.item.teaserImage ? 
                  <ScrollView
                    horizontal={true}
                    height={250}
                    decelerationRate="fast"
                    snapToAlignment={'left'}
                    snapToInterval={300}
                    >
                    <Image
                      style={styles.imageDetail}
                      source={
                              this.state.item.teaserImage === 'Bolt' ? boltImage : 
                              this.state.item.teaserImage === 'Leaf' ? leafImage : 
                              this.state.item.teaserImage === 'Kona' ? konaImage : 
                              this.state.item.teaserImage === '500e' ? fiatImage : 
                              this.state.item.teaserImage === 'i3' ? i3Image : 
                              this.state.item.teaserImage === 'Golf' ? golfImage : 
                              this.state.item.teaserImage === '330e' ? bmwImage : 
                              this.state.item.teaserImage === 'Prime' ? primeImage : 
                              this.state.item.teaserImage === 'Volt' ? voltImage : 
                              this.state.item.teaserImage === 'Niro' ? niroImage : 
                              this.state.item.teaserImage === 'Model3' ? model3Image : 
                              null
                              }
                      />
                      {this.state.item.teaserImage === 'Model3' ? null :
                      <Image
                        style={styles.imageDetail}
                        source={
                                this.state.item.teaserImage === 'Bolt' ? boltImage1 : 
                                this.state.item.teaserImage === 'Leaf' ? leafImage1 : 
                                this.state.item.teaserImage === 'Kona' ? konaImage1 : 
                                this.state.item.teaserImage === '500e' ? fiatImage1 : 
                                this.state.item.teaserImage === 'i3' ? i3Image1 : 
                                this.state.item.teaserImage === 'Golf' ? golfImage1 : 
                                this.state.item.teaserImage === 'Prime' ? primeImage1 : 
                                this.state.item.teaserImage === 'Volt' ? voltImage1 : 
                                this.state.item.teaserImage === 'Model3' ? model3Image1 : 
                                null
                                }
                        />}
                        {this.state.item.teaserImage === 'Model3' ? null :
                        <Image
                          style={styles.imageDetail}
                          source={
                                  this.state.item.teaserImage === 'Bolt' ? boltImage2 : 
                                  this.state.item.teaserImage === 'Leaf' ? leafImage2 : 
                                  this.state.item.teaserImage === 'Kona' ? konaImage2 : 
                                  this.state.item.teaserImage === '500e' ? fiatImage2 : 
                                  this.state.item.teaserImage === 'i3' ? i3Image2 : 
                                  this.state.item.teaserImage === 'Golf' ? golfImage2 : 
                                  this.state.item.teaserImage === 'Prime' ? primeImage2 : 
                                  this.state.item.teaserImage === 'Volt' ? voltImage2 : 
                                  this.state.item.teaserImage === 'Model3' ? model3Image2 : 
                                  null
                                  }
                          />}
                          {this.state.item.teaserImage === 'Model3' ? null :
                          <Image
                            style={styles.imageDetail}
                            source={
                                    this.state.item.teaserImage === 'Bolt' ? boltImage3 : 
                                    this.state.item.teaserImage === 'Leaf' ? leafImage3 : 
                                    this.state.item.teaserImage === 'Kona' ? konaImage3 : 
                                    this.state.item.teaserImage === '500e' ? fiatImage3 : 
                                    this.state.item.teaserImage === 'i3' ? i3Image3 : 
                                    this.state.item.teaserImage === 'Golf' ? golfImage3 : 
                                    this.state.item.teaserImage === 'Prime' ? primeImage3 : 
                                    this.state.item.teaserImage === 'Volt' ? voltImage3 : 
                                    this.state.item.teaserImage === 'Model3' ? model3Image3 : 
                                    null
                                    }
                            />}
                  </ScrollView>
                  : null }

                <View style={{padding: 20}}>

                    <View>
                      <Text style={[styles.newsTitle, {fontSize: 20}]}>
                        {this.state.item["Year"]} { this.state.item["Make and Model"] }
                      </Text>
                      {/*<Text style={{fontWeight: '500', fontSize: 17}}>
                      {' '}{this.state.item["$/mo"]}/month, {this.state.item["down+acq"]} down
                      </Text>*/}

                      
                      <Animatable.View animation="zoomInUp">

                        <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: 'lightgrey', alignItems: 'center', justifyContent: 'space-around'}}>
                          <View style={[styles.infoBox, {borderRightWidth: 1, borderColor: 'lightgrey'}]}>
                            <Text style={{fontWeight: '700', fontSize: 17, textAlign: 'center', color: '#2191fb'}}>{ this.state.item["$/mo"] } + tax</Text>
                            <Text style={{color: '#2191fb', textAlign: 'center'}} >Monthly payment</Text>
                          </View>
                          <View style={styles.infoBox}>
                            <Text style={{fontWeight: '700', fontSize: 17, textAlign: 'center'}}>{ this.state.item["months"] } Months</Text>
                            <Text style={{textAlign: 'center'}}>Lease Term</Text>
                          </View>
                        </View>

                        <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: 'lightgrey', alignItems: 'center', justifyContent: 'space-around'}}>
                          <View style={[styles.infoBox, {borderRightWidth: 1, borderColor: 'lightgrey'}]}>
                            <Text style={{fontWeight: '700', fontSize: 17, textAlign: 'center'}}>{ this.state.item["down+acq"] }</Text>
                            <Text style={{textAlign: 'center'}} >Down payment</Text>
                          </View>
                          <View style={styles.infoBox}>
                            <Text style={{fontWeight: '700', fontSize: 17, textAlign: 'center', color: '#2191fb'}}>{ this.state.item["DriveOffEst"] }</Text>
                            <Text style={{color: '#2191fb', textAlign: 'center'}}>Drive-off *</Text>
                          </View>
                        </View>


                        <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: 'lightgrey', alignItems: 'center', justifyContent: 'space-around'}}>
                          <View style={[styles.infoBox, {borderRightWidth: 1, borderColor: 'lightgrey'}]}>
                            <Text style={{fontWeight: '700', fontSize: 17, textAlign: 'center'}}>{ this.state.item["miles/yr"] }</Text>
                            <Text style={{textAlign: 'center'}} >Miles per year</Text>
                          </View>
                          <View style={styles.infoBox}>
                            <Text style={{fontWeight: '700', fontSize: 17, textAlign: 'center'}}>Excellent</Text>
                            <Text style={{textAlign: 'center'}}>Credit Required</Text>
                          </View>
                        </View>



                        {this.state.left && this.state.item["Make and Model"] !== "Tesla Model 3" ? 
                        
                        <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: 'lightgrey', alignItems: 'center', justifyContent: 'space-around'}}>
                          <View style={[styles.infoBox]}>
                            <Text style={{textAlign: 'center'}} >Pickup Location:</Text>
                            <Text style={{fontWeight: '700', fontSize: 17, textAlign: 'center'}}>{this.state.item["location"]}</Text>
                          </View>
                        </View>

                         : null }

                        <Text> </Text>

                        {this.state.left && this.state.item["Make and Model"] !== "Tesla Model 3" ? 
                        <Text style={{color: 'grey'}}>
                          <Text>* Guaranteed drive-off includes all fees & incentives:</Text>{'\n'}
                          <Text>✓ $650 acquisition fee</Text>{'\n'}
                          <Text>✓ $685 license/registration fee</Text>{'\n'}
                          <Text>✓ $122 doc processing/EVR/DMV tire fee</Text>{'\n'}
                          <Text>✓ $823 tax on incentive</Text>{'\n'}
                          { this.state.item["StateIncentive"] ? <Text style={{}}>✓ {this.state.item["StateIncentive"]} cash back ("state rebate")</Text> : null }{'\n'}
                          {this.state.region === "CA(N)"  || this.state.region === "CA(S)" ? <Text style={{}}>PG&E rebate not yet included.</Text> : null }{'\n'}
                        </Text> :
                        <Text>
                          <Text>* Final drive-off includes:</Text>{'\n'}
                          <Text>✓ $1,199 destination + doc charge</Text>{'\n'}
                          { this.state.item["StateIncentive"] ? <Text style={{}}>✓ {this.state.item["StateIncentive"]} cash back ("state rebate")</Text> : null }{'\n'}
                          {this.state.region === "CA(N)"  || this.state.region === "CA(S)" ? <Text style={{}}>PG&E rebate</Text> : null }{'\n'}
                        </Text> }

                        <Text>That works out to:</Text>
                        <Text>Dollars per mile:  { this.state.item["$/mi"] }</Text>
                        <Text>Total amount over lease:  { this.state.item["$ total"] } ("one pay")</Text>
                        <Text>Averaged over lease:  { this.state.item["$/mo avg"] } ("zero down price")</Text>

                        
                        
                        <Text> </Text>
                       {this.state.left && this.state.item["Make and Model"] !== "Tesla Model 3" ? 
                         <Text style={{fontSize: 12, fontWeight: '400', textAlign: 'center', color: 'salmon'}}>  {this.state.left} left at this price</Text> 
                           : null }
                        <Text> </Text>
                        {this.state.left && this.state.item["Make and Model"] !== "Tesla Model 3" ? 
                          <Button
                            type="solid"
                            buttonStyle={styles.bigButton}
                            onPress={() => this.props.navigation.navigate('Submit', {item: this.state.item, type: 'Lease'} )}
                            title={`Continue ❱`}
                            /> : null }
                          
                        <Text> </Text>

                      </Animatable.View>
                      
                    </View>

                    

                    <Text> </Text>
                    <Text> </Text>
                    <View style={styles.separator} />
                    <Text> </Text>
                    <Text> </Text>
                    
                    <FeedbackComponent />

                </View>
           </ScrollView>
         : null }
        </View>
    );

  }
}