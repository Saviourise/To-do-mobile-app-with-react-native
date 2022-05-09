import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Appbar, TextInput, Button} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const App = () => {
  const [text, setText] = React.useState('');
  const [items, setItems] = React.useState([]);

  const addText = async () => {
    if (text === '') {
      return ToastAndroid.showWithGravity(
        'Input cannot be left empty',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
    try {
      let texts = items;
      texts.unshift(text);
      setItems(texts);
      const jsonValue = JSON.stringify(texts);
      await AsyncStorage.setItem('items', jsonValue).then(() => {
        setText('');
      });
    } catch (error) {
      // Error saving data
      return ToastAndroid.showWithGravity(
        error,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };

  const getItems = async () => {
    try {
      const value = await AsyncStorage.getItem('items');
      if (value !== null) {
        // We have data!!
        setItems(JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
      return ToastAndroid.showWithGravity(
        error,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };

  const [checked, setChecked] = React.useState(false);

  const delItem = async deleteItem => {
    //console.log(deleteItem);
    let itms = await AsyncStorage.getItem('items');
    let itemDel = JSON.parse(itms);
    let itemIndex = items.indexOf(deleteItem);
    itemDel.splice(itemIndex, 1);
    //setItems(itemDel);
    //console.log(items.join().replace(deleteItem, ''));
    try {
      const jsonValue = JSON.stringify(itemDel);
      await AsyncStorage.setItem('items', jsonValue).then(() => {
        setItems([]);
        setChecked(false);
        return ToastAndroid.showWithGravity(
          'Task Finished',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      });
    } catch (error) {
      // Error retrieving data
      return ToastAndroid.showWithGravity(
        error,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };
  // static setItem(key: string, value: string, [callback]: ?(error: ?Error) => void)
  //Hide Splash screen on app load.
  React.useEffect(() => {
    SplashScreen.hide();
    getItems();
  });
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        animated={true}
        backgroundColor="#8E05C2"
        barStyle="light-content"
      />

      <Appbar.Header style={{backgroundColor: '#8E05C2'}}>
        <Appbar.Content
          title="To do"
          subtitle={'Create a list of what to do'}
        />
      </Appbar.Header>
      <View style={styles.header}>
        <TextInput
          placeholder="Input Task"
          value={text}
          onChangeText={text => setText(text)}
          style={{width: '70%', height: 40, marginRight: 20}}
        />
        <Button color="#8E05C2" mode="contained" onPress={addText}>
          Add
        </Button>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {items.length > 0 ? (
          items.map((item, i) => {
            return (
              <View key={i} style={styles.list}>
                {/* <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={(isChecked: boolean) => {
                  setChecked(!checked);
                }}
              /> */}

                <BouncyCheckbox
                  size={20}
                  fillColor="#8E05C2"
                  unfillColor="#FFFFFF"
                  isChecked={false}
                  text={item}
                  iconStyle={{borderColor: '#8E05C2'}}
                  textStyle={{fontFamily: 'JosefinSans-Regular', color: '#fff'}}
                  onPress={() => {
                    setChecked(!checked);
                    delItem(item);
                  }}
                />
              </View>
            );
          })
        ) : (
          <View style={styles.list}>
            {/* <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={(isChecked: boolean) => {
            setChecked(!checked);
          }}
        /> */}

            <BouncyCheckbox
              size={25}
              fillColor="#8E05C2"
              unfillColor="#FFFFFF"
              text={'Add New Item'}
              iconStyle={{borderColor: '#8E05C2'}}
              textStyle={{fontFamily: 'JosefinSans-Regular', color: '#fff'}}
              onPress={() => {
                setChecked(!checked);
                delItem('Add New Item');
              }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    padding: 30,
  },
  list: {
    backgroundColor: '#8E05C2',
    width: '90%',
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
  },
});

export default App;
