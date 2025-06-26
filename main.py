import math
import random

def main():
    print("Welcome to the Gambling Website")
    game = input("Which game would you like to play?\n1. Blackjack\n2. Roulette")
    if game == 1:
        
def BlackJack():
    card_categories =  ["Hearts", "Diamonds", "Spades", "Clubs"]
    card_numbers = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"]
    deck = [(card, category) for category in card_categories for card in card_numbers]

    random.shuffle(deck)
    player_card = [deck.pop(), deck.pop()]
    dealer_card = [deck.pop(), deck.pop()]
    
def player_turn():
    
def dealer_turn():

def check_bust(player_card, dealer_card):

    while True:
        player_score = sum(card_type(card) for card in player_card)
        dealer_score = sum(card_type(card) for card in dealer_card)
        if player_score > 21:
            return True
        if dealer_score > 21:
            return True


def card_type(card):
    if card[0] in ["Jack", "Queen", "King"]:
        return 10
    elif card[0] in ["Ace"]:
        return 11
    else:
        return int(card[0])

wallet = 100

def Roulette():

    while True:
        global wallet

        if wallet <= 0:
            print("you're out of money!")
            return
        
        print(f"current wallet balance = {wallet}")
        try:
            bet_amount = int(input("How much would you like to bet?\nInput bet amount: "))
            if bet_amount > wallet or bet_amount <= 0:
                print("You dont have enough money...")
                return
            
        except ValueError:
            print("Invalid input")
            return

        num = random.randint(1,38)
        print(f"[TEST] Roulette rolled: {num}")
        bet_choice1 = input("\nWhich odds would you like to bet on?\n1. Colours\n2. Numbers\nInput: ")
        
        if bet_choice1 == "1":
            won = betColours(num)
            if won:
                print("You win!")
                wallet += bet_amount
            
            else:
                print("You lose!")
                wallet -= bet_amount

        elif bet_choice1 == "2":
            won = betNumbers(num)
            if won:
                print("You win!")
                wallet += bet_amount * 35
            
            else:
                print("You lose!")
                wallet -= bet_amount

        else:
            print("Invalid option")

        print(f"Wallet balance: {wallet}")

def betColours(num):
    
    try:
        bet_choice1a = int(input("\nWhich colour would you like to bet on?\n1. Red\n2. Black\n3. Green\nInput: "))

    except ValueError:
        print("invalid input")
        return False
    
    return checkColour(num, bet_choice1a)

def betNumbers(num):
    
    try:
        bet_choice1b = int(input("\nWhich number would you like to bet on?\nInput: "))

    except ValueError:
        print("invalid input")
        return False
    
    return num == bet_choice1b

def checkEven(num):
    if (num % 2) == 0:
        return True
    
def checkColour(num, bet_choice1a):
    
    if 1 <= num <= 10:
        if checkEven(num):
            if bet_choice1a == 2:
                return True
    elif 11 <= num <= 19:
        if checkEven(num):
            if bet_choice1a == 1:
                return True
    elif 20 <= num <= 27:
        if checkEven(num):
            if bet_choice1a == 2:
                return True
    elif 28 <= num <= 36:
        if checkEven(num):
            if bet_choice1a == 1:
                return True
    elif 37 <= num <= 38:
        if bet_choice1a == 3:
            return True
    
    return False 


Roulette()