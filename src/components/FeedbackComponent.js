import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator, TextInput } from 'react-native';
import { Button } from 'react-native-elements';



export default class FeedbackComponent extends React.Component {

constructor(props) {
  super(props);
  this.state = { 
    thanks: false,
    feedback: null
     };
}


_onSubmitFeedback(){
      
    fetch('https://electrade-server.herokuapp.com/api/comments/create/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            feedback: this.state.feedback
          }),
      }).then((res) => this.setState({thanks: true}))
  }



render() {
  return (
    <View style={{flex: 1}}>
      {/* FEEDBACK */}
        {this.state.thanks ? <View style={styles.deal}><Text style={styles.newsTitle}>Thanks!</Text><Text>We really appreciate your feedback! If you left an email, we may follow up with you.</Text></View>
          :
          <View>
            <Text style={styles.newsTitle}>
              Feedback about this page? Looking for something else?
            </Text>
            <TextInput 
              underlineColorAndroid="transparent"
              style={[styles.textInput, {height: 100, textAlign: 'left'}]}
              placeholder={'Please enter it here and hit Send Feedback. Include your email if you want us to get back to you.'}
              value={this.state.feedback}
              multiline={true}
              onChangeText={ (text) => this.setState({feedback: text})}
              />
            <Button
              type="outline"
              buttonStyle={{borderRadius: 10, margin: 5}}
              onPress={() => this._onSubmitFeedback()} 
              title="Send Feedback" 
              />
        </View> }
    </View>
  );

}
}