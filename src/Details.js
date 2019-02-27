import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles'

export default class DetailScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state = { 
       };

  }


  componentDidMount() {
      this.setState({item: this.props.navigation.getParam('item') })
  }
 

  render() {
    return (
       <View>

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
          <ScrollView style={{height: '100%'}}>
                <Image
                    style={styles.imageDetail}
                    source={{uri: this.state.item.image}}
                    />
                <View style={{padding: 20}}>
                  {this.state.item.price ? <Text style={{fontWeight: '500', fontSize: 20}}>${ this.state.item.price }</Text> : null }
                  {this.state.item.name ? <Text>{ this.state.item.name }</Text> : null }
                  {this.state.item.text ? <Text>{ this.state.item.text.substring(0, this.state.item.text.indexOf('http')) }</Text> : null }
                  {this.state.item.source ? 
                      <Button title={`Continue at ${this.state.item.source}`} onPress={() => Linking.openURL(this.state.item.link.toString())}/> :
                      <Button title={`Contact Owner`} onPress={() => this.state.item.link.charAt(0) === 'm' ? Linking.openURL(this.state.item.link.toString()) : Linking.openURL('https://www.edmunds.com'+this.state.item.link.toString())}/> }
                </View>
           </ScrollView>
         : null }
        </View>
    );

  }
}

