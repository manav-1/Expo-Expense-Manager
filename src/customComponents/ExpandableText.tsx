import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {App} from '../state/store';
import {observer} from 'mobx-react';

const ExpandableText = observer(
  ({
    text,
    customStyle,
    value,
  }: {
    text: String;
    customStyle?: any;
    value?: String;
  }) => {
    const [nLines, setNLines] = React.useState(false);
    const styles = StyleSheet.create({
      noteText: {
        fontFamily: App.theme.secondaryFont.MEDIUM,
        fontSize: 25,
        width: '60%',
        color: App.theme.secondary,
        paddingVertical: 7,
      },
      noteValue: {
        fontFamily: App.theme.primaryFont.MEDIUM,
        fontSize: 18,
        color: App.theme.secondary,
      },
      noteContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
    });
    return (
      <View style={styles.noteContainer}>
        <Text
          style={[styles.noteText, customStyle]}
          numberOfLines={nLines ? 0 : 1}
          onPress={() => setNLines(!nLines)}>
          {text.toString()}
        </Text>
        {value ? (
          <Text style={[styles.noteValue, customStyle]}>{value}</Text>
        ) : null}
      </View>
    );
  },
);

export default ExpandableText;
