// https://www.youtube.com/results?search_query=electric+vehicle+reviews&sp=CAI%253D
// https://www.youtube.com/results?search_query=ev+electric+vehicle+review&sp=CAI%253D
// https://m.youtube.com/results?search_query=ev+electric+vehicle+review&persist_app=1&app=m&uploaded=d



import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import DetailScreen from './Details';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')

// import YouTube from 'react-native-youtube'



export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      email: null,
      loading: null
       };

    this._getData = this._getData.bind(this)
  }


  componentDidMount() {
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        {this.state.email ? Mixpanel.identify(this.state.email) : null }
        if(this.state.email !== 'niko'){Mixpanel.track("VideoScreen Loaded") }
        // if(this.state.email === 'niko'){ AsyncStorage.removeItem('remainingtrials') }
      })

      // this._getData()
  }

  _getData(){
    // this.setState({loading: true})
    // fetch('https://api.apify.com/v1/rG44NsjnfukCkKecE/crawlers/Z79rSy82LB9BxDyaa/lastExec/results?token=u8HqK39BcB8PKAFsjMtb9Bnnh')
    //   .then(res => { return res.json()})

    //   // merge arrays from different sites
    //   .then(json =>  {   let finalArray = []
    //                      for (i = 0; i < json.length; i++){
    //                             if (i === 0) { finalArray = json[0].pageFunctionResult; }
    //                             else { finalArray = finalArray.concat( json[i].pageFunctionResult ); }
    //                           } 
    //                      return finalArray
    //                   })

    //   // sort by date
    //   .then(merged => {  return merged.sort((a,b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0))  })

    //   // convert date to string
    //   .then(sorted => { 
    //                     for (i = 0; i < sorted.length; i++){
    //                             sorted[i].date = new Date(sorted[i].date * 1000).toLocaleTimeString("en-US")
    //                             sorted[i].date = sorted[i].date.substring(0, sorted[i].date.length - 6) + ' ' + sorted[i].date.substring(8)
    //                             // console.log(sorted[i].date)
    //                           } 
    //                     return sorted  
    //                   })

    //   // set results as state
    //   .then((sorted) => { 
    //                   this.setState({data: sorted, loading: false}); 
    //                   // console.log(sorted)

    //                   })
  }

  

  render() {
    return (
      <View style={{flex: 1}}>
        {!this.state.loading ?
           <View>
             {/*<FlatList
                       data={this.state.data}
                       keyExtractor={(item, index) => index.toString()}
                       renderItem={({item, index}) => 
                            <View style={{marginTop: index === 0 ? 40 : 0, marginBottom: index === this.state.data.length -1 ? 80 : 0}}>
                              <TouchableOpacity 
                                  onPress={() => this.props.navigation.navigate('Details', {item: item} ) } 
                                  style={{flexDirection: 'row', display: 'flex'}} > 
                                <View style={{flex: 0.3}}>
                                  <Image
                                          style={styles.image}
                                          source={{uri: item.image}}
                                        />
                                </View>
                                <View style={{flex: 0.7}}>
                                  <Text style={styles.newsTitle}>{item.text.substring(0, item.text.indexOf('http'))}</Text>
                                  <Text style={styles.newsSource}>{item.date} | {item.source}</Text>
                                </View>
                              </TouchableOpacity>
                              <View style={styles.separator} />
                            </View>
                     }
                     />*/}
              {/*<YouTube
                videoId="0I24N9stcig"   
                play={true}             
                fullscreen={true}

                onReady={e => this.setState({ isReady: true })}
                onChangeState={e => this.setState({ status: e.state })}
                onChangeQuality={e => this.setState({ quality: e.quality })}
                onError={e => this.setState({ error: e.error })}

                style={{ alignSelf: 'stretch', height: 300 }}
              />*/}
            </View>
            :
            <View style={{marginTop: 100, alignItems: 'center'}}>
              <Text style={{color: 'grey'}}>Getting EV news... </Text>
              <ActivityIndicator />
            </View>
          }
      </View>
    );

  }
}