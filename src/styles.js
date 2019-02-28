import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    

    // general 
    newsItem:{    	
        padding: 5,
        margin: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowOffset: {  width: 0,  height: 2,  },
        shadowColor: 'lightgrey',
        shadowOpacity: 1.0
    },

    image:{
        width: '100%', 
        height: 100
    },

    imageDetail:{
        width: '100%', 
        height: 300
    },

    imageCar:{
        width: '100%',
        height: 80
    },

    imageVideo:{
        width: '100%',
        height: 80
    },

    newsTitle:{
        fontSize: 15,
        fontWeight: '800',
        padding: 5
    },

    newsSource:{
        paddingLeft: 5,
        color: '#999999'
    },

    separator: {
    	borderBottomWidth: 1,
    	borderBottomColor: 'lightgrey'
    },

    textInput:{
      borderColor: 'lightgray', 
      borderWidth: 1, 
      borderRadius: 10, 
      padding: 10, 
      margin: 5,
      fontSize: 15,
      textAlign: 'center',
      height: 40, 
    }


}); 