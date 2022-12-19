import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {App} from '../state/store';

const ExpandableText = ({
  text,
  customStyle,
  value,
}: {
  text: String;
  customStyle?: any;
  value?: String;
}) => {
  const [nLines, setNLines] = React.useState(false);
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
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
};
const styles = StyleSheet.create({
  noteText: {
    fontFamily: App.theme.secondaryFont.MEDIUM,
    fontSize: 25,
    width: '60%',
    color: '#fff',
    paddingVertical: 7,
  },
  noteValue: {
    fontFamily: App.theme.primaryFont.MEDIUM,
    fontSize: 18,
    color: '#fff',
  },
});

export default ExpandableText;
