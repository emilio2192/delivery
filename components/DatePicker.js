import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export class MyDatePicker extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Calendar
                    markedDates={{ [this.props.current ]: {selected: true, dotColor: '#ffcc56', activeOpacity: 1} }}
                    // Handler which gets executed on day press. Default = undefined
                    onDayPress={(day) => this.props.onDayPress(day.dateString)}
                    // Handler which gets executed on day long press. Default = undefined
                    onDayLongPress={(day) => { console.log('selected day', day) }}
                    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    monthFormat={'MMMM yyyy'}
                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                    onMonthChange={(month) => { console.log('month changed', month) }}
                    // day from another month that is visible in calendar page. Default = false
                    disableMonthChange={true}
                    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                    firstDay={1}
                    theme={{
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#b6c1cd',
                        selectedDayTextColor: '#ffffff',
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#d9e1e8',
                        dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                        arrowColor: '#fdce5c',
                        textDayFontFamily: 'roboto',
                        textDayHeaderFontFamily: 'roboto',
                        textMonthFontWeight: 'bold',
                        textDayFontSize: 12,
                        textDayHeaderFontSize: 12,
                        'stylesheet.calendar.header': {
                            monthText: {
                                fontFamily: 'roboto-semibold',
                                fontSize: 14,
                                marginVertical: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                color: '#5b5b5b',
                                textTransform: 'uppercase'
                            }
                        },
                        'stylesheet.day.basic': {
                            today: {
                                backgroundColor: '#ffeecc',
                                borderRadius: 50
                            },
                            todayText: {
                                color: '#ffcc56',
                                fontFamily: 'roboto-bold'
                            }
                        },
                        'stylesheet.calendar.main': {
                            container: {
                                paddingLeft: 5,
                                paddingRight: 5,
                                backgroundColor: 'white',
                                borderRadius: 30,
                                paddingBottom: 20
                            },
                        },
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch'
    }
});
