import React, { useEffect, useState } from "react";
import { Alert, Modal, ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useTripLogs } from "../../../services/triplogs/journals.context";

const Container = styled(ScrollView).attrs({
  showsVerticalScrollIndicator: false,
  keyboardShouldPersistTaps: "handled",
})`
  flex: 1;
  background-color: #72b2e3;
  padding: 24px;
`;

const BackButton = styled.TouchableOpacity`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Header = styled.Text`
  font-size: 34px;
  color: white;
  text-align: center;
  margin-bottom: 40px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const InputBox = styled.View`
  background-color: ${(props) => (props.dark ? "#3f77a1" : "#d7e6f1")};
  width: 48%;
  padding: 16px 18px;
  border-radius: 30px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const DateInputButton = styled.TouchableOpacity`
  background-color: #3f77a1;
  width: 48%;
  padding: 16px 18px;
  border-radius: 30px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const InputText = styled.TextInput.attrs((props) => ({
  placeholderTextColor: props.dark ? "rgba(255, 255, 255, 0.75)" : "#5c89ae",
}))`
  font-size: 18px;
  color: ${(props) => (props.dark ? "white" : "#3a6e97")};
  text-align: left;
`;

const DateInputText = styled.Text`
  font-size: 18px;
  color: white;
`;

const SectionLabel = styled.Text`
  font-size: 18px;
  color: white;
  margin-bottom: 14px;
`;

const ChecklistButton = styled.TouchableOpacity`
  background-color: #b9d9f2;
  width: 210px;
  padding: 16px 20px;
  border-radius: 25px;
  margin-bottom: 14px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const ChecklistText = styled.Text`
  color: #3a6e97;
  font-size: 16px;
  margin-left: 8px;
`;

const ChecklistItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 14px;
`;

const ChecklistInput = styled.TextInput.attrs({
  placeholderTextColor: "#5c89ae",
})`
  flex: 1;
  background-color: #f2f2f2;
  color: #3a6e97;
  font-size: 16px;
  border-radius: 24px;
  padding: 16px 18px;
  margin-right: 10px;
`;

const RemoveButton = styled.TouchableOpacity`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background-color: #3f77a1;
  align-items: center;
  justify-content: center;
`;

const ReflectionTitle = styled.Text`
  font-size: 34px;
  color: white;
  margin-top: 30px;
`;

const Divider = styled.View`
  height: 2px;
  background-color: white;
  margin-top: 6px;
  margin-bottom: 25px;
`;

const ReflectionBox = styled.View`
  background-color: #f2f2f2;
  min-height: 220px;
  border-radius: 35px;
  padding: 24px;
  margin-bottom: 30px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const ReflectionLabel = styled.Text`
  font-size: 18px;
  color: #3a6e97;
`;

const ReflectionInput = styled.TextInput.attrs({
  placeholderTextColor: "#5c89ae",
  multiline: true,
  textAlignVertical: "top",
})`
  color: #3a6e97;
  font-size: 16px;
  margin-top: 14px;
  min-height: 150px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #d7e6f1;
  padding: 18px 20px;
  border-radius: 28px;
  align-items: center;
  margin-bottom: 36px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const SaveButtonText = styled.Text`
  font-size: 18px;
  color: #3a6e97;
  font-weight: 600;
`;

const ModalBackdrop = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.35);
  justify-content: center;
  padding: 24px;
`;

const CalendarCard = styled.TouchableOpacity`
  background-color: white;
  border-radius: 28px;
  padding: 22px;
`;

const CalendarHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const CalendarTitle = styled.Text`
  font-size: 22px;
  color: #3a6e97;
  font-weight: 600;
`;

const CalendarNavButton = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background-color: #d7e6f1;
  align-items: center;
  justify-content: center;
`;

const WeekRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const WeekDayText = styled.Text`
  width: 36px;
  text-align: center;
  color: #5c89ae;
  font-size: 13px;
  font-weight: 600;
`;

const DaysGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const DayButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background-color: ${(props) => (props.selected ? "#72b2e3" : "transparent")};
`;

const DayText = styled.Text`
  color: ${(props) =>
    props.selected ? "white" : props.muted ? "#c0c7ce" : "#3a6e97"};
  font-size: 15px;
  font-weight: ${(props) => (props.selected ? "700" : "500")};
`;

const CalendarFooter = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 10px;
`;

const CalendarAction = styled.TouchableOpacity`
  padding: 10px 14px;
`;

const CalendarActionText = styled.Text`
  color: #3a6e97;
  font-size: 16px;
  font-weight: 600;
`;

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatDate = (dateValue) =>
  dateValue.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const parseJournalDate = (value) => {
  if (!value) {
    return new Date();
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return new Date();
  }

  return parsedDate;
};

const getCalendarDays = (visibleMonthDate) => {
  const year = visibleMonthDate.getFullYear();
  const month = visibleMonthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const leadingEmptyDays = firstDayOfMonth.getDay();
  const totalCells = Math.ceil((leadingEmptyDays + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - leadingEmptyDays + 1;

    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return null;
    }

    return new Date(year, month, dayNumber);
  });
};

const emptyJournal = {
  title: "",
  date: "",
  checklistItems: [],
  beforeTripNotes: "",
  afterTripNotes: "",
};

export const CreateJournalScreen = ({ navigation, route }) => {
  const { getJournalById, saveJournal } = useTripLogs();
  const journalId = route?.params?.journalId;
  const existingJournal = journalId ? getJournalById(journalId) : null;

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [checklistItems, setChecklistItems] = useState([]);
  const [beforeTripNotes, setBeforeTripNotes] = useState("");
  const [afterTripNotes, setAfterTripNotes] = useState("");
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleMonthDate, setVisibleMonthDate] = useState(new Date());

  useEffect(() => {
    const journal = existingJournal || emptyJournal;
    const parsedDate = parseJournalDate(journal.date);

    setTitle(journal.title);
    setDate(journal.date);
    setChecklistItems(journal.checklistItems);
    setBeforeTripNotes(journal.beforeTripNotes);
    setAfterTripNotes(journal.afterTripNotes);
    setSelectedDate(journal.date ? parsedDate : null);
    setVisibleMonthDate(parsedDate);
  }, [existingJournal]);

  const handleAddChecklistItem = () => {
    setChecklistItems((currentItems) => [...currentItems, ""]);
  };

  const handleChecklistItemChange = (value, itemIndex) => {
    setChecklistItems((currentItems) =>
      currentItems.map((item, index) => (index === itemIndex ? value : item))
    );
  };

  const handleRemoveChecklistItem = (itemIndex) => {
    setChecklistItems((currentItems) =>
      currentItems.filter((_, index) => index !== itemIndex)
    );
  };

  const handleOpenCalendar = () => {
    setVisibleMonthDate(selectedDate || new Date());
    setIsCalendarVisible(true);
  };

  const handleSelectDate = (pickedDate) => {
    setSelectedDate(pickedDate);
    setDate(formatDate(pickedDate));
    setIsCalendarVisible(false);
  };

  const handleChangeMonth = (direction) => {
    setVisibleMonthDate(
      (currentDate) =>
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + direction,
          1
        )
    );
  };

  const handleSaveJournal = () => {
    const savedJournalId = saveJournal({
      id: journalId,
      title,
      date,
      checklistItems,
      beforeTripNotes,
      afterTripNotes,
    });

    Alert.alert(
      "Journal saved",
      "Your trip journal has been updated and added to TripLog."
    );

    navigation.navigate("TripLogsMain", {
      savedJournalId,
    });
  };

  const calendarDays = getCalendarDays(visibleMonthDate);

  return (
    <Container>
      <BackButton onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={34} color="#6b6b6b" />
      </BackButton>

      <Header>{journalId ? "Edit Journal" : "Create Journal"}</Header>

      <Row>
        <InputBox>
          <InputText
            placeholder="Add a Title"
            value={title}
            onChangeText={setTitle}
          />
        </InputBox>

        <DateInputButton onPress={handleOpenCalendar}>
          <DateInputText>{date || "Add a Date"}</DateInputText>
        </DateInputButton>
      </Row>

      <SectionLabel>Check list for this trip</SectionLabel>

      {checklistItems.map((item, index) => (
        <ChecklistItemRow key={`${journalId || "new"}-${index}`}>
          <ChecklistInput
            placeholder="Add an item"
            value={item}
            onChangeText={(value) => handleChecklistItemChange(value, index)}
          />
          <RemoveButton onPress={() => handleRemoveChecklistItem(index)}>
            <Ionicons name="close" size={20} color="white" />
          </RemoveButton>
        </ChecklistItemRow>
      ))}

      <ChecklistButton onPress={handleAddChecklistItem}>
        <Ionicons name="add-circle-outline" size={22} color="#3a6e97" />
        <ChecklistText>Add an item</ChecklistText>
      </ChecklistButton>

      <ReflectionTitle>Reflection</ReflectionTitle>
      <Divider />

      <ReflectionBox>
        <ReflectionLabel>Before the Trip</ReflectionLabel>
        <ReflectionInput
          placeholder="Write your notes before the trip..."
          value={beforeTripNotes}
          onChangeText={setBeforeTripNotes}
        />
      </ReflectionBox>

      <ReflectionBox>
        <ReflectionLabel>After the Trip</ReflectionLabel>
        <ReflectionInput
          placeholder="Write your notes after the trip..."
          value={afterTripNotes}
          onChangeText={setAfterTripNotes}
        />
      </ReflectionBox>

      <SaveButton onPress={handleSaveJournal}>
        <SaveButtonText>Save Journal</SaveButtonText>
      </SaveButton>

      <Modal
        animationType="fade"
        transparent
        visible={isCalendarVisible}
        onRequestClose={() => setIsCalendarVisible(false)}
      >
        <ModalBackdrop
          activeOpacity={1}
          onPress={() => setIsCalendarVisible(false)}
        >
          <CalendarCard activeOpacity={1} onPress={() => {}}>
            <CalendarHeader>
              <CalendarNavButton onPress={() => handleChangeMonth(-1)}>
                <Ionicons name="chevron-back" size={20} color="#3a6e97" />
              </CalendarNavButton>
              <CalendarTitle>
                {visibleMonthDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </CalendarTitle>
              <CalendarNavButton onPress={() => handleChangeMonth(1)}>
                <Ionicons name="chevron-forward" size={20} color="#3a6e97" />
              </CalendarNavButton>
            </CalendarHeader>

            <WeekRow>
              {weekdayLabels.map((label) => (
                <WeekDayText key={label}>{label}</WeekDayText>
              ))}
            </WeekRow>

            <DaysGrid>
              {calendarDays.map((calendarDate, index) => {
                const isSelected =
                  calendarDate &&
                  selectedDate &&
                  calendarDate.toDateString() === selectedDate.toDateString();

                return (
                  <DayButton
                    key={`${visibleMonthDate.getMonth()}-${index}`}
                    selected={isSelected}
                    disabled={!calendarDate}
                    onPress={() =>
                      calendarDate && handleSelectDate(calendarDate)
                    }
                  >
                    <DayText selected={isSelected} muted={!calendarDate}>
                      {calendarDate ? calendarDate.getDate() : ""}
                    </DayText>
                  </DayButton>
                );
              })}
            </DaysGrid>

            <CalendarFooter>
              <CalendarAction onPress={() => setIsCalendarVisible(false)}>
                <CalendarActionText>Close</CalendarActionText>
              </CalendarAction>
            </CalendarFooter>
          </CalendarCard>
        </ModalBackdrop>
      </Modal>
    </Container>
  );
};
