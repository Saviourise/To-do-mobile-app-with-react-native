/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Appbar,
  TextInput,
  Button,
  FAB,
  TouchableRipple,
  Modal,
  Portal,
  Text,
  Provider,
  Title,
  Surface,
  IconButton,
} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const App = () => {
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [finishedvisible, setFinishedVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateMode, setdateMode] = useState('date');
  const [date, setDate] = useState('No date selected');
  const [time, setTime] = useState('No time selected');
  const [todayItems, setTodayItems] = useState([]);
  const [otherItems, setOtherItems] = useState([]);
  const [overdueItems, setOverdueItems] = useState([]);
  const [d, setD] = useState(new Date());
  const [finishedItems, setFinishedItems] = useState([]);
  const [greet, setGreet] = useState('Good Day Champ');
  const months = [
    'Jan',
    'Feb',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    //console.log('handleSheetChanges', index);
  }, []);

  // const showModal = () => setVisible(true);
  // const hideModal = () => {
  //   setVisible(false);
  //   hideDatePicker();
  // };

  const showfinishedModal = () => setFinishedVisible(true);
  const hidefinishedModal = () => {
    setFinishedVisible(false);
  };

  const showDatePicker = () => {
    setdateMode('date');
    setDatePickerVisibility(true);
    //console.log('hi');
  };

  const showTimePicker = () => {
    setdateMode('time');
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = datee => {
    //console.warn('A date has been picked: ', date);
    let year;
    let month;
    let dateCal;
    let hrs;
    let mins;
    if (dateMode === 'date') {
      //console.log(date.getFullYear(), date.getMonth(), date.getDate());

      // var dates =
      //   String(date.getFullYear()) +
      //   '/' +
      //   String(date.getMonth()) +
      //   '/' +
      //   String(date.getDate());
      //let cdDate = new Date(dates).getTime();
      //console.log(cdDate);
      year = datee.getFullYear().toString();
      month = months[datee.getMonth()];
      dateCal = datee.getDate().toString();

      setDate(`${dateCal} ${month} ${year}`);
    }
    if (dateMode === 'time') {
      //let times = String(date.getHours()) + ':' + String(date.getMinutes());
      //console.log(cdTime);
      hrs = datee.getHours().toString();
      mins = datee.getMinutes().toString();

      var hours = hrs;
      if (mins.length === 1) {
        var minutes = `0${mins}`;
      } else {
        var minutes = mins;
      }

      if (Number(hours) > 12) {
        hours = String(Number(hours) - 12);
        hours = hours;
        setTime(`${hours}:${minutes} PM`);
      } else if (Number(hours) === 12) {
        hours = hours;
        setTime(`${hours}:${minutes} PM`);
      } else {
        hours = hours;
        setTime(`${hours}:${minutes} AM`);
      }
    }
    //console.log(year, month, dateCal, hrs, mins);
    hideDatePicker();
  };

  const addText = async () => {
    if (text === '') {
      return ToastAndroid.showWithGravity(
        'Input cannot be left empty',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }

    //let cdDate = new Date(dates).getTime();
    let cdDate;
    if (date !== 'No date selected' && time !== 'No time selcted') {
      let mil = date;
      let mill = time;
      if (mill.includes('AM')) {
        mill = mill.replace(' AM', '');
      } else {
        mill = mill.replace(' PM', '');
      }
      if (
        time.split(' ')[1] === 'AM' ||
        time.split(' ')[0].split(':')[0] === '0' ||
        time.split(' ')[0].split(':')[0] === '12'
      ) {
        var getHr = Number(time.split(' ')[0].split(':')[0]);
      } else {
        var getHr = Number(time.split(' ')[0].split(':')[0]) + 12;
      }
      //1652308140000
      let millarr = mill.split(':');
      millarr[0] = getHr;
      mill = millarr.join(':');
      //console.log(millarr);
      mill = mill.replace(' ', ':');

      let milll = mil + ' ' + mill;

      cdDate = new Date(milll).getTime();
      //console.log(cdDate);
    } else {
      cdDate = 16523081400000000;
    }
    try {
      let texts = items;
      let newitemObj = {
        task: text,
        time: time,
        date: date,
        millisecs: cdDate,
      };
      //console.log(newitemObj);
      texts.unshift(newitemObj);
      setItems(texts);
      const jsonValue = JSON.stringify(texts);
      await AsyncStorage.setItem('items', jsonValue).then(() => {
        setText('');
        setDate('No date selected');
        setTime('No time selected');
        getItems();
        bottomSheetModalRef.current?.dismiss();
        //hideModal();
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
    let finishedIitems = await AsyncStorage.getItem('finishedItems');
    if (finishedIitems !== null) {
      let fItems = JSON.parse(finishedIitems);
      fItems.sort((a, b) => {
        return a.millisecs - b.millisecs;
      });
      setFinishedItems(fItems);
    }
    try {
      const value = await AsyncStorage.getItem('items');
      if (value !== null) {
        // We have data!!
        setItems(JSON.parse(value));
        let parsedValue = JSON.parse(value);
        let todayItms = [];
        let otherItms = [];
        let overdueItms = [];

        parsedValue.map(val => {
          //console.log(months.indexOf(val.date.split(' ')[1]));
          if (
            val.date.split(' ')[2] === String(d.getFullYear()) &&
            val.date.split(' ')[1] === months[d.getMonth()] &&
            val.date.split(' ')[0] === String(d.getDate())
          ) {
            if (
              val.time.split(' ')[1] === 'AM' ||
              val.time.split(' ')[0].split(':')[0] === '0' ||
              val.time.split(' ')[0].split(':')[0] === '12'
            ) {
              var getHr = Number(val.time.split(' ')[0].split(':')[0]);
            } else if (val.time === 'No time selected') {
              var getHr = 1000000;
            } else {
              var getHr = Number(val.time.split(' ')[0].split(':')[0]) + 12;
            }

            if (d.getHours() > getHr) {
              //console.log( 'due' );
              overdueItms.push(val);
            } else if (d.getHours() === getHr) {
              var getMin = Number(val.time.split(' ')[0].split(':')[1]);
              if (d.getMinutes() > getMin) {
                //console.log('hi', getMin);
                overdueItms.push(val);
              } else {
                todayItms.push(val);
              }
            } else {
              todayItms.push(val);
            }
            //console.log(getHr, d.getHours());
          } else if (
            Number(val.date.split(' ')[2]) < Number(String(d.getFullYear()))
          ) {
            overdueItms.push(val);
          } else if (
            months.indexOf(val.date.split(' ')[1]) <
              Number(String(d.getMonth())) &&
            val.date.split(' ')[2] === String(d.getFullYear()) &&
            months.indexOf(val.date.split(' ')[1]) > -1
          ) {
            overdueItms.push(val);
          } else if (
            val.date.split(' ')[2] === String(d.getFullYear()) &&
            val.date.split(' ')[1] === months[d.getMonth()] &&
            Number(val.date.split(' ')[0]) < d.getDate()
          ) {
            overdueItms.push(val);
          } else {
            otherItms.push(val);
          }
        });
        todayItms.sort((a, b) => {
          return a.millisecs - b.millisecs;
        });
        overdueItms.sort((a, b) => {
          return a.millisecs - b.millisecs;
        });
        otherItms.sort((a, b) => {
          return a.millisecs - b.millisecs;
        });
        setTodayItems(todayItms);
        setOverdueItems(overdueItms);
        setOtherItems(otherItms);
        //console.log(JSON.parse(value));
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

  const [checked, setChecked] = useState(false);

  const delItem = async (
    deleteItem,
    deleteDate,
    deleteTime,
    deleteMillisecs,
  ) => {
    let delObj = {
      task: deleteItem,
      time: deleteTime,
      date: deleteDate,
      millisecs: deleteMillisecs,
    };
    //console.log(delObj);
    let itms = await AsyncStorage.getItem('items');
    let itemDel = JSON.parse(itms);
    //console.log(itemDel);
    for (let itmdel of itemDel) {
      //console.log(itmdel);
      if (JSON.stringify(itmdel) === JSON.stringify(delObj)) {
        var itmInd = itemDel.indexOf(itmdel);
        var itmm = delObj;
      }
    }

    let finishedIitems = await AsyncStorage.getItem('finishedItems');
    //console.log(finishedIitems);
    let finItems = [];
    //console.log(itmm);
    if (finishedIitems !== null) {
      let finItemss = JSON.parse(finishedIitems);
      finItemss.push(itmm);
      finItems = finItemss;
      //console.log(finItems);
    } else {
      finItems.push(itmm);
      //console.log(finItems);
    }

    const jsonVal = JSON.stringify(finItems);
    await AsyncStorage.setItem('finishedItems', jsonVal)
      .then(() => {
        //console.log(jsonVal);
      })
      .catch(e => {
        console.warn(e);
      });
    itemDel.splice(itmInd, 1);
    setItems(itemDel);
    //console.log(items.join().replace(deleteItem, ''));
    try {
      const jsonValue = JSON.stringify(itemDel);
      await AsyncStorage.setItem('items', jsonValue).then(() => {
        setItems([]);
        setTodayItems([]);
        setOverdueItems([]);
        setOtherItems([]);
        return ToastAndroid.showWithGravity(
          'Task Finished',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      });
      getItems();
    } catch (error) {
      // Error retrieving data
      return ToastAndroid.showWithGravity(
        error,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };

  // setInterval(() => {
  //   let d = new Date();
  //   setD(d);
  //   getItems();
  // }, 60000);

  //Hide Splash screen on app load.
  useEffect(() => {
    getItems();
    setTimeout(function () {
      SplashScreen.hide();
    }, 2000);
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView
        style={{flex: 1, backgroundColor: '#344FA1', paddingHorizontal: 20}}>
        <StatusBar
          animated={true}
          backgroundColor="#344FA1"
          barStyle="light-content"
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: -20, marginVertical: 10,}}>
          <IconButton
            icon="plus"
            color="#fff"
            size={25}
            onPress={handlePresentModalPress}
          />
          <IconButton
            icon="calendar-check"
            color="#ffff"
            size={25}
            onPress={showfinishedModal}
          />
        </View>

        <Title
          style={{
            color: '#fff',
            textAlign: 'left',
            marginVertical: 20,
            fontSize: 35,
          }}>
          {greet}
        </Title>

        {/* <ScrollView contentContainerStyle={styles.content}> */}
        <Title
          style={{
            color: '#aaa',
            textAlign: 'left',
            marginBottom: 10,
            fontSize: 15,
          }}>
          Overdue Tasks
        </Title>
        <ScrollView contentContainerStyle={styles.content} horizontal={true}>
          {overdueItems.length !== 0 ? (
            overdueItems.map((item, i) => {
              return (
                <Surface key={i} style={styles.list2}>
                  {/* <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={(isChecked: boolean) => {
                  setChecked(!checked);
                }}
              /> */}

                  <BouncyCheckbox
                    size={20}
                    fillColor="#042159"
                    unfillColor="#FFFFFF"
                    isChecked={false}
                    text={item.task}
                    iconStyle={{borderColor: '#042159'}}
                    textStyle={{
                      fontFamily: 'JosefinSans-Regular',
                      color: '#fff',
                    }}
                    onPress={() => {
                      setChecked(!checked);
                      delItem(item.task, item.date, item.time, item.millisecs);
                    }}
                  />
                  <Text
                    style={{
                      color: '#344FA1',
                      marginTop: 20,
                    }}>{`${item.date}, ${item.time}`}</Text>
                </Surface>
              );
            })
          ) : (
            <Text style={{color: '#aaa'}}>No overdue tasks</Text>
          )}
        </ScrollView>

        <Title
          style={{
            color: '#aaa',
            textAlign: 'left',
            marginBottom: 10,
            fontSize: 15,
          }}>
          Today Tasks
        </Title>
        <ScrollView contentContainerStyle={styles.content} horizontal={true}>
          {todayItems.length !== 0 ? (
            todayItems.map((item, i) => {
              return (
                <Surface key={i} style={styles.list2}>
                  {/* <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={(isChecked: boolean) => {
                  setChecked(!checked);
                }}
              /> */}

                  <BouncyCheckbox
                    size={20}
                    fillColor="#042159"
                    unfillColor="#FFFFFF"
                    isChecked={false}
                    text={item.task}
                    iconStyle={{borderColor: '#042159'}}
                    textStyle={{
                      fontFamily: 'JosefinSans-Regular',
                      color: '#fff',
                    }}
                    onPress={() => {
                      setChecked(!checked);
                      delItem(item.task, item.date, item.time, item.millisecs);
                    }}
                  />
                  <Text
                    style={{
                      color: '#344FA1',
                      marginTop: 20,
                    }}>{`${item.date}, ${item.time}`}</Text>
                </Surface>
              );
            })
          ) : (
            <Text style={{color: '#aaa'}}>No tasks scheduled for today</Text>
          )}
        </ScrollView>
        <Title
          style={{
            color: '#aaa',
            textAlign: 'left',
            marginBottom: 10,
            fontSize: 15,
          }}>
          Other Tasks
        </Title>
        <ScrollView contentContainerStyle={styles.content}>
          {otherItems.length !== 0 ? (
            otherItems.map((item, i) => {
              return (
                <Surface key={i} style={styles.list3}>
                  {/* <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={(isChecked: boolean) => {
                  setChecked(!checked);
                }}
              /> */}

                  <BouncyCheckbox
                    size={20}
                    fillColor="#042159"
                    unfillColor="#FFFFFF"
                    isChecked={false}
                    text={item.task}
                    iconStyle={{borderColor: '#042159'}}
                    textStyle={{
                      fontFamily: 'JosefinSans-Regular',
                      color: '#fff',
                    }}
                    onPress={() => {
                      setChecked(!checked);
                      delItem(item.task, item.date, item.time, item.millisecs);
                    }}
                  />
                  <Text
                    style={{
                      color: '#344FA1',
                      marginTop: 10,
                    }}>{`${item.date}, ${item.time}`}</Text>
                </Surface>
              );
            })
          ) : (
            <Text style={{color: '#aaa'}}>No other tasks</Text>
          )}
        </ScrollView>
        {/* </ScrollView> */}

        <FAB style={styles.fab} icon="plus" onPress={handlePresentModalPress} />

        <Provider>
          <Portal>
            {/* <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={styles.containerStyle}>
              <Text
                style={{fontSize: 20, color: '#8E05C2', textAlign: 'center'}}>
                Add a task!
              </Text>
              <View style={styles.header}>
                <TextInput
                  placeholder="Input Task"
                  value={text}
                  onChangeText={text => setText(text)}
                  activeUnderlineColor="#8E05C2"
                  style={{width: '100%', height: 40, marginVertical: 20}}
                />
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    marginBottom: 20,
                  }}>
                  <Text
                    style={{color: '#aaa', width: '50%', textAlign: 'center'}}>
                    {date}
                  </Text>
                  <Text
                    style={{color: '#aaa', width: '50%', textAlign: 'center'}}>
                    {time}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                  }}>
                  <Button
                    color="#8E05C2"
                    mode="outlined"
                    onPress={showDatePicker}
                    style={{width: '40%', marginBottom: 20}}>
                    Add date
                  </Button>
                  <Button
                    color="#8E05C2"
                    mode="outlined"
                    onPress={showTimePicker}
                    style={{width: '40%', marginBottom: 20}}>
                    Add Time
                  </Button>
                </View>
                <Button
                  color="#8E05C2"
                  mode="contained"
                  onPress={addText}
                  style={{width: '100%', marginVertical: 20}}>
                  Add Task
                </Button>
              </View>
            </Modal> */}

            <Modal
              visible={finishedvisible}
              onDismiss={hidefinishedModal}
              contentContainerStyle={styles.containerStyle}>
              <Text
                style={{fontSize: 20, color: '#D707F2', textAlign: 'center'}}>
                Finished Tasks!
              </Text>
              <ScrollView>
                {finishedItems.length !== 0 ? (
                  finishedItems.map((item, i) => {
                    return (
                      <View key={i} style={styles.list4}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 20,
                          }}>{`${item.task}`}</Text>
                        <Text
                          style={{
                            color: '#aaa',
                            marginTop: 10,
                          }}>{`${item.date}, ${item.time}`}</Text>
                      </View>
                    );
                  })
                ) : (
                  <Text style={{color: '#aaa'}}>No finsihed tasks</Text>
                )}
              </ScrollView>
            </Modal>
          </Portal>
        </Provider>
        <View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode={dateMode}
            onConfirm={selDate => handleConfirm(selDate)}
            onCancel={hideDatePicker}
          />
        </View>
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            style={styles.sheet}
            keyboardBehavior="fillParent">
            <Text
              style={{
                fontSize: 30,
                color: '#000',
                textAlign: 'center',
                marginVertical: 20,
              }}>
              Add a task!
            </Text>
            <View style={styles.header}>
              <TextInput
                placeholder="Input Task"
                value={text}
                onChangeText={text => setText(text)}
                outlineColor="#fff"
                activeOutlineColor="#D707F2"
                mode="outlined"
                style={{width: '100%', height: 40, marginVertical: 20}}
              />

              <View
                style={{
                  width: '100%',
                  justifyContent: 'space-around',
                  flexDirection: 'row',
                }}>
                <IconButton
                  icon="calendar"
                  color="#D707F2"
                  size={30}
                  onPress={showDatePicker}
                />
                <IconButton
                  icon="clock"
                  color="#D707F2"
                  size={30}
                  onPress={showTimePicker}
                />
              </View>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  marginBottom: 20,
                }}>
                <Text
                  style={{color: '#aaa', width: '50%', textAlign: 'center'}}>
                  {date}
                </Text>
                <Text
                  style={{color: '#aaa', width: '50%', textAlign: 'center'}}>
                  {time}
                </Text>
              </View>
              <Button
                color="#D707F2"
                mode="contained"
                onPress={addText}
                style={{width: '100%', marginVertical: 20}}>
                Add Task
              </Button>
            </View>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  sheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 46,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingRight: 20,
    height: 130,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  header: {
    width: '100%',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  list2: {
    backgroundColor: '#042159',
    justifyContent: 'center',
    width: 220,
    borderRadius: 10,
    height: 120,
    marginHorizontal: 10,
    padding: 20,
    elevation: 10,
  },
  list3: {
    backgroundColor: '#042159',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 10,
    height: 70,
    marginHorizontal: 10,
    padding: 20,
    elevation: 10,
  },
  list4: {
    backgroundColor: '#042159',
    width: '100%',
    marginVertical: 20,
    borderRadius: 10,
    padding: 15,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#D707F2',
  },
  containerStyle: {
    backgroundColor: '#fff',
    padding: 30,
    margin: 30,
    borderRadius: 10,
  },
});

export default App;
