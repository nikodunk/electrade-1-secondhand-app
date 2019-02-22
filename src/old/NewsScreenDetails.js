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

    //this._getData = this._getData.bind(this)

  }


  componentDidMount() {
      this.setState({item: this.props.navigation.getParam('item') })
  }
 

  render() {
    return (
       <View>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{left: 10, marginTop: 30}}><Text style={{fontSize: 18, color: 'dodgerblue'}}>Back</Text></TouchableOpacity>
        {this.state.item ?
          <ScrollView style={{padding: 5}}>
            <Text style={styles.newsTitle}>{ this.state.item.title }</Text>
                <Image
                                        style={styles.image}
                                        source={{uri: this.state.item.image}}
                                      />
                <Text>{ this.state.item.description.toString().slice(this.state.item.description.toString().indexOf("<p>") + 3, this.state.item.description.toString().indexOf("<a")) }</Text>
            <Button title={'Continue In Browser'} onPress={() => Linking.openURL(this.state.item.link.toString())}/>
           </ScrollView>
         : null }
        </View>
    );

  }
}

