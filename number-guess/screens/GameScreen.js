import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	Alert,
	FlatList,
	Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import NumberContainer from "../components/NumberContainer";
import Card from "../components/Card";
import DefaultStyles from "../constants/default-styles";
import MainButton from "../components/MainButton";
import BodyText from "../components/BodyText";

const generateRandomBetween = (min, max, exclude) => {
	min = Math.ceil(min);
	max = Math.floor(max);

	const randomNumber = Math.floor(Math.random() * (max - min)) + min;
	if (randomNumber === exclude) {
		return generateRandomBetween(min, max, exclude);
	} else {
		return randomNumber;
	}
};

const renderListItem = (listLength, itemData) => (
	<View style={styles.listItem}>
		<BodyText>#{listLength - itemData.index}</BodyText>
		<BodyText>{itemData.item}</BodyText>
	</View>
);

const GameScreen = (props) => {
	const initialGuess = generateRandomBetween(1, 100, props.userChoice);
	const [currentGuess, setCurrentGuess] = useState(initialGuess);
	const [pastAttempts, setPastAttempts] = useState([initialGuess.toString()]);
	const currentLow = useRef(1);
	const currentHigh = useRef(100);

	const { userChoice, onGameOver } = props;

	useEffect(() => {
		if (currentGuess === userChoice) {
			onGameOver(pastAttempts.length);
		}
	}, [currentGuess, userChoice, onGameOver]);

	const nextGuessHandler = (direction) => {
		if (
			(direction === "LOWER" && currentGuess < props.userChoice) ||
			(direction === "HIGHER" && currentGuess > props.userChoice)
		) {
			Alert.alert("Don't lie!", "You know this is wrong....", [
				{ text: "Sorry!", style: "cancel" },
			]);
			return;
		}
		if (direction === "LOWER") {
			currentHigh.current = currentGuess;
		} else {
			currentLow.current = currentGuess + 1;
		}
		const nextNumber = generateRandomBetween(
			currentLow.current,
			currentHigh.current,
			currentGuess
		);
		setCurrentGuess(nextNumber);
		setPastAttempts((currPastGuesses) => [
			nextNumber.toString(),
			...currPastGuesses,
		]);
	};

	let listContainerStyle = styles.listContainer;

	if(Dimensions.get('window').width < 350) {
		listContainerStyle = styles.listContainerSmallDevice;
	}

	return (
		<View style={styles.screen}>
			<Text style={DefaultStyles.title}>Opponent's Guess</Text>
			<NumberContainer>{currentGuess}</NumberContainer>
			<Card style={styles.buttonContainer}>
				<MainButton onPress={nextGuessHandler.bind(this, "LOWER")}>
					<Ionicons name="remove" size={24} color="white" />
				</MainButton>
				<MainButton onPress={nextGuessHandler.bind(this, "HIGHER")}>
					<Ionicons name="add" size={24} color="white" />
				</MainButton>
			</Card>
			<View style={listContainerStyle}>
				<FlatList
					keyExtractor={(item) => item}
					data={pastAttempts}
					renderItem={renderListItem.bind(this, pastAttempts.length)}
					contentContainerStyle={styles.list}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		padding: 10,
		alignItems: "center",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: Dimensions.get("window").height > 600 ? 20 : 10,
		width: 400,
		maxWidth: "90%",
	},
	listItem: {
		borderColor: "#ccc",
		borderWidth: 1,
		padding: 15,
		marginVertical: 10,
		backgroundColor: "white",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	listContainer: {
		flex: 1,
		width: "60%",
	},
	listContainerSmallDevice: {
		flex:1,
		width:'80%',
	},
	list: {
		flexGrow: 1,
		justifyContent: "flex-end",
	},
});

export default GameScreen;
