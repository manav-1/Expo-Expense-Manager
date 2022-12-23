import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';
import ExpandableText from './ExpandableText';
import Ionicons from '@expo/vector-icons/Ionicons';
import {App} from '../state/store';
import {RFPercentage} from 'react-native-responsive-fontsize';
import moment from 'moment';
import {observer} from 'mobx-react';

const CustomNote = observer(
  ({note, deleteNote}: {note: any; deleteNote: Function}) => {
    const {noteText, date} = note;
    const styles = StyleSheet.create({
      note: {
        backgroundColor: App.theme.primary,
        borderColor: App.theme.secondary,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
        paddingHorizontal: 5,
        minHeight: RFPercentage(8),
        flexDirection: 'row',
        alignItems: 'center',
      },
      dateText: {
        fontFamily: App.theme.secondaryFont.MEDIUM,
        fontSize: 13,
        color: App.theme.secondary,
        position: 'absolute',
        bottom: 3,
        right: 5,
      },
      iconButton: {
        position: 'absolute',
        right: 5,
        top: 5,
      },
    });

    return (
      <View style={styles.note}>
        <ExpandableText text={capitalize(noteText)} />
        <Text style={styles.dateText}>
          {moment(date).format('ddd DD MMM, YY')}
        </Text>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.iconButton}
          onPress={() => deleteNote()}>
          <Ionicons name="close-circle-outline" size={22} color="#F05454" />
        </TouchableOpacity>
      </View>
    );
  },
);

export default CustomNote;
