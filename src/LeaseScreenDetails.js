import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Mixpanel from 'react-native-mixpanel'
import styles from './styles'
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';


const model3Image = require('./img/model3.jpg')
const boltImage = require('./img/bolt.jpg')
const leafImage = require('./img/leaf.jpg')
const konaImage = require('./img/kona.jpg')
const etronImage = require('./img/etron.jpg')
const i3Image = require('./img/i3.jpg')
const fiatImage = require('./img/fiat.jpg')
const golfImage = require('./img/golf.jpg')

const bmwImage = require('./img/bmw330e.jpg')
const primeImage = require('./img/prime.jpg')
const voltImage = require('./img/volt.jpg')
const niroImage = require('./img/niro.jpg')




export default class DetailScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state = { 
      type: null,
      item: null
       };

  }


  componentDidMount() {
      this.setState({item: this.props.navigation.getParam('item') })
      this.setState({type: this.props.navigation.getParam('type') })
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email !== 'niko'){Mixpanel.track(this.state.type+"Details Loaded") }
        // if(this.state.email === 'niko'){ AsyncStorage.removeItem('remainingtrials') }
        firebase.analytics().logEvent(this.state.type+'DetailsScreen_Loaded')
      })
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
                { this.state.item.image ? 
                  <Image
                    style={styles.imageDetail}
                    source={{uri: this.state.item.image}}
                    /> : null }

                { this.state.item.teaserImage ? 
                  <Image
                    style={[styles.imageDetail, { maxWidth: '96%' }]}
                    source={
                            this.state.item.teaserImage === 'Bolt' ? boltImage : 
                            this.state.item.teaserImage === 'Leaf' ? leafImage : 
                            this.state.item.teaserImage === 'Etron' ? etronImage : 
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
                    /> : null }

                <View style={{padding: 20}}>

                {/* NEWS options */}
                  {this.state.item.text ? <Text>{ this.state.item.text.substring(0, this.state.item.text.indexOf('http')) } {'\n'}</Text> : null }
                  {this.state.type === 'News' ? 
                          <Button 
                              icon={
                                <Icon
                                name="ios-open"
                                size={20}
                                color="white"
                                /> } 
                              title={` Continue at ${this.state.item.source}`} 
                              buttonStyle={styles.bigButton} 
                              onPress={() => {Linking.openURL(this.state.item.link.toString()); if(this.state.email !== 'niko'){Mixpanel.track(this.state.item.link.toString()+" touched") }}}
                          />  
                  : null }

                {/* marketplace & gallery options */}
                  {this.state.type === 'Gallery' || this.state.type === 'Marketplace' ?
                    <View>
                      {this.state.item.price ? <Text style={{fontWeight: '500', fontSize: 20}}>${ this.state.item.price }</Text> : null }
                      {this.state.item.name ? <Text>{ this.state.item.name }</Text> : null }
                      {this.state.item.mileageFromOdometer && this.state.item.mileageFromOdometer.value ? <Text style={styles.newsSource}>{this.state.item.mileageFromOdometer.value} miles</Text> : null}
                      {this.state.item.description ? <Text style={styles.newsSource}>{this.state.item.description} {'\n'}</Text> : null}
                      {this.state.type === 'Marketplace' ? <Button icon={
                                <Icon
                                name="ios-open"
                                size={20}
                                color="white"
                                /> } title={` Contact Seller on Autotrader`} buttonStyle={styles.bigButton} onPress={() => Linking.openURL(this.state.item.url) }/>  : null }
                    </View> : null }

                {/* lease details */}
                  {this.state.type === 'Lease' ?
                    <View>
                      <Text style={[styles.newsTitle, {fontSize: 20}]}>{this.state.item["Year"]} { this.state.item["Make and Model"] }
                      </Text>
                      <Text style={{fontWeight: '500', fontSize: 17}}>
                        {this.state.item["$/mo"]}/month, {this.state.item["down+acq"]} down
                      </Text>
                      {/*<Text style={{}}>
                        { this.state.item.blurb }
                      </Text>
                      <View style={styles.separator} />
                      <Text> </Text>
                      
                      <Text style={{fontWeight: '500', color: '#1a2a3a'}}>
                        { this.state.item.stats }
                        {'\n'}
                      </Text>*/}
                      <Text> </Text>
                      <View style={styles.separator} />
                      <Text> </Text>

                      <Text style={{fontWeight: '700'}}>Offer Details</Text>
                      <Text>Down payment: { this.state.item["down+acq"] }</Text>
                      <Text>Monthly payment:  { this.state.item["$/mo"] } + tax</Text>
                      <Text>Months:  { this.state.item["months"] }</Text>
                      <Text>Miles per year:  { this.state.item["miles/yr"] }</Text>
                      <Text>Total amount:  { this.state.item["$ total"] } ("one pay")</Text>
                      <Text>Average over lease:  { this.state.item["$/mo avg"] } ("zero down price")</Text>
                      <Text>Dollars per mile:  { this.state.item["$/mi"] }</Text>
                      <Text> </Text>
                      <Button
                        type="solid"
                        buttonStyle={styles.bigButton}
                        onPress={() => this.props.navigation.navigate('Submit', {item: this.state.item, type: 'Lease'} )}
                        title={`Get this deal`} 
                        />
                    </View> : null }

                </View>
           </ScrollView>
         : null }
        </View>
    );

  }
}

