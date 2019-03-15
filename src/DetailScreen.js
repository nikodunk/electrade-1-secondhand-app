import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Mixpanel from 'react-native-mixpanel'
import styles from './styles'


const model3Image = require('./img/model3.jpg')
const boltImage = require('./img/bolt.jpg')
const leafImage = require('./img/leaf.jpg')
const konaImage = require('./img/kona.jpg')
const etronImage = require('./img/etron.jpg')




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
          <ScrollView style={{maxHeight: '80%'}}>
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
                          model3Image}
                    /> : null }

                <View style={{padding: 20}}>

                {/* NEWS options */}
                  {this.state.item.text ? <Text>{ this.state.item.text.substring(0, this.state.item.text.indexOf('http')) }</Text> : null }
                  {this.state.type === 'News' ? <Button title={`Continue at ${this.state.item.source}`} onPress={() => {Linking.openURL(this.state.item.link.toString()); if(this.state.email !== 'niko'){Mixpanel.track(this.state.item.link.toString()+" touched") }}}/>  : null }

                {/* marketplace & gallery options */}
                  {this.state.type === 'Gallery' || this.state.type === 'Marketplace' ?
                    <View>
                      {this.state.item.price ? <Text style={{fontWeight: '500', fontSize: 20}}>${ this.state.item.price }</Text> : null }
                      {this.state.item.name ? <Text>{ this.state.item.name }</Text> : null }
                      {this.state.item.mileageFromOdometer && this.state.item.mileageFromOdometer.value ? <Text style={styles.newsSource}>{this.state.item.mileageFromOdometer.value} miles</Text> : null}
                      {this.state.item.description ? <Text style={styles.newsSource}>{this.state.item.description}</Text> : null}
                      {this.state.type === 'Marketplace' ? <Button title={`Contact Seller on Autotrader`} onPress={() => Linking.openURL(this.state.item.url) }/>  : null }
                    </View> : null }

                {/* lease options */}
                  {this.state.type === 'Lease' ?
                    <View>
                      <Text style={[styles.newsTitle, {fontSize: 20}]}>
                        { this.state.item.title }
                      </Text>
                      <Text style={{fontWeight: '500', fontSize: 15}}>
                        { this.state.item.price }
                        {'\n'}
                      </Text>
                      <Text>
                        { this.state.item.details }
                        {'\n'}
                      </Text>
                      <Button title={`Get this deal`} onPress={() => this.props.navigation.navigate('Submit', {item: this.state.item, type: 'Lease'} )}/>
                    </View> : null }

                </View>
           </ScrollView>
         : null }
        </View>
    );

  }
}

