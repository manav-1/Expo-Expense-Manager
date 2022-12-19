import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import {MainContainer} from '../customComponents/styledComponents';
import DatePicker from 'react-native-neat-date-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Yup from 'yup';
import CustomNote from '../customComponents/CustomNote';
import {snackbar} from '../state/snackbar';
import {App, NoteIF} from '../state/store';
import {observer} from 'mobx-react';
import moment from 'moment';

const Notes = observer(() => {
  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState('');
  const [notes, setNotes] = React.useState<NoteIF[]>();
  const [notesVisible, setNotesVisible] = React.useState(false);

  React.useEffect(() => {
    setNotes(App.notes);
  }, []);

  const handleNewNote = () => {
    const values = {date: date, noteText: note};
    const validationSchema = Yup.object({
      date: Yup.date().required('Date is required'),
      noteText: Yup.string().required('Note is required'),
    });
    validationSchema
      .validate(values)
      .then(async () => {
        await App.addNote(values);
        snackbar.openSnackBar('Added Successfully');
        setNote('');
        setDate(new Date());
        setNotesVisible(false);
      })
      .catch(error => {
        snackbar.openSnackBar(error.message);
      });
    setNotesVisible(false);
  };

  const styles = StyleSheet.create({
    tabBarTitle: {
      fontSize: 25,
      paddingVertical: 10,
      marginVertical: 5,
      color: App.theme.secondary,
      fontFamily: App.theme.primaryFont.MEDIUM,
    },
    tabStyles: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: App.theme.primary,
    },
    addNoteButton: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: App.theme.secondary + 'dd',
      justifyContent: 'center',
      alignItems: 'center',
    },
    noteAddContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    noteInput: {
      borderBottomWidth: 1,
      color: App.theme.secondary,
      flex: 7,
      fontFamily: App.theme.primaryFont.MEDIUM,
    },
    dateInput: {
      color: App.theme.secondary,
      fontFamily: App.theme.primaryFont.MEDIUM,
      marginRight: 10,
    },
    noteSaveButton: {
      backgroundColor: App.theme.secondary + 'dd',
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
      flex: 2,
    },
    dateButton: {
      flex: 3,
    },
    noteSaveButtonText: {color: App.theme.primary},
    datePickerStyles: {
      backgroundColor: App.theme.primary,
      // @ts-ignore (styles not applicable in stylesheet)
      selectedDateBackgroundColor: App.theme.accent,
      headerColor: App.theme.secondary,
      headerTextColor: App.theme.primary,
      confirmButtonColor: App.theme.secondary,
      weekDaysColor: App.theme.accent,
      dateTextColor: App.theme.secondary,
    },
  });

  return (
    <MainContainer>
      <View style={styles.tabStyles}>
        <Text style={styles.tabBarTitle}>Notes</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.addNoteButton}
          onPress={() => setNotesVisible(!notesVisible)}>
          <Ionicons
            name={!notesVisible ? 'add' : 'close'}
            color={App.theme.primary}
            size={25}
          />
        </TouchableOpacity>
      </View>
      {notesVisible ? (
        <>
          <View style={styles.noteAddContainer}>
            <TextInput
              multiline
              placeholder="Enter note"
              placeholderTextColor={App.theme.secondary + 'aa'}
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setOpen(true)}>
              <Text style={styles.dateInput}>
                {moment(date.toISOString()).format('DD MMM, YY')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.noteSaveButton}
              onPress={handleNewNote}>
              <Text style={styles.noteSaveButtonText}>Save</Text>
              <Ionicons
                name="save-outline"
                color={App.theme.primary}
                size={18}
              />
            </TouchableOpacity>
          </View>
          <DatePicker
            isVisible={open}
            mode={'single'}
            colorOptions={styles.datePickerStyles}
            onConfirm={(date: any) => {
              setOpen(false);
              setDate(date.date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </>
      ) : (
        <></>
      )}
      <ScrollView>
        {notes?.map(note => (
          <CustomNote
            key={String(note.noteId)}
            note={note}
            deleteNote={() => App.deleteNote(Number(note.noteId))}
          />
        ))}
      </ScrollView>
    </MainContainer>
  );
});

// const Notes = observer(() => {
//   return <Text>Notes</Text>;
// });

export default Notes;
