import math
import random

def main():
    num = random.randint(1,38)
    #Temporary
    print(num)
    bet_choice1 = input("\nWhich odds would you like to bet on?\n1. Colours\n2. Numbers\nInput: ")
    #Colours
    if bet_choice1 == "1":
        betColours(num)
    elif bet_choice1 == "2":
        betNumbers(num)



def betColours(num):
    bet_choice1a = int(input("\nWhich colour would you like to bet on?\n1. Red\n2. Black\n3. Green\nInput: "))
    if checkColour(num, bet_choice1a):
        print("you win")
    else: 
        print("you lose")

def betNumbers(num):
    bet_choice1b = int(input("\nWhich number would you like to bet on?\nInput: "))
    if num == bet_choice1b:
        print("you win")
    else:
        print("you lose")

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
            print("you win")
    
main()