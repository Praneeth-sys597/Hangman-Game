export const PREDEFINED_WORDS = [
  'PYTHON',
  'HANGMAN',
  'VARIABLE',
  'COMPUTER',
  'ALGORITHM',
] as const;

export const MAX_INCORRECT_GUESSES = 6;

// ASCII stages representing 0 to 6 mistakes
export const ASCII_STAGES = [
  // 0 incorrect guesses
  `  +---+
  |   |
      |
      |
      |
      |
========`,

  // 1 incorrect guess: head
  `  +---+
  |   |
  O   |
      |
      |
      |
========`,

  // 2 incorrect guesses: head + torso
  `  +---+
  |   |
  O   |
  |   |
      |
      |
========`,

  // 3 incorrect guesses: head + torso + left arm
  `  +---+
  |   |
  O   |
 /|   |
      |
      |
========`,

  // 4 incorrect guesses: head + torso + both arms
  `  +---+
  |   |
  O   |
 /|\\  |
      |
      |
========`,

  // 5 incorrect guesses: head + torso + both arms + left leg
  `  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
========`,

  // 6 incorrect guesses: full figure (Game Over)
  `  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
========`,
];

export const PYTHON_REFERENCE_CODE = `import random

# 1. LISTS: 5 predefined words
words = ["PYTHON", "HANGMAN", "VARIABLE", "COMPUTER", "ALGORITHM"]

# 2. RANDOM: Choose a random word from the list
secret_word = random.choice(words)

guessed_letters = []  # LIST: tracks letters guessed by player
incorrect_guesses = 0
max_incorrect = 6

print("========================================")
print("       TEXT-BASED HANGMAN GAME")
print("========================================")
print("Welcome! Guess the word one letter at a time.")
print(f"You have up to {max_incorrect} incorrect guesses allowed.\\n")

# 3. WHILE LOOP: Runs until player wins or runs out of guesses
while incorrect_guesses < max_incorrect:
    # 4. STRINGS: Display the masked word with underscores
    display_word = " ".join([char if char in guessed_letters else "_" for char in secret_word])
    print(f"\\nWord: {display_word}")
    print(f"Incorrect guesses left: {max_incorrect - incorrect_guesses}")
    print(f"Guessed letters: {', '.join(guessed_letters) if guessed_letters else 'None'}")
    
    # 5. IF-ELSE: Check if the full word is guessed
    if "_" not in display_word:
        print(f"\\nCONGRATULATIONS! You guessed the word: {secret_word}")
        break
        
    guess = input("Enter a letter: ").strip().upper()
    
    # IF-ELSE: Validate player input
    if len(guess) != 1 or not guess.isalpha():
        print("Please enter a single valid letter.")
        continue
        
    if guess in guessed_letters:
        print(f"You already guessed '{guess}'. Try another letter.")
        continue
        
    # Append guess to the list
    guessed_letters.append(guess)
    
    # IF-ELSE: Check if the letter is in the secret word
    if guess in secret_word:
        print(f"Good guess! '{guess}' is in the word.")
    else:
        incorrect_guesses += 1
        print(f"Sorry, '{guess}' is not in the word.")

# IF-ELSE: Game over state check
if incorrect_guesses >= max_incorrect:
    print(f"\\nGAME OVER! You ran out of guesses.")
    print(f"The secret word was: {secret_word}")
`;

export const CONCEPTS = [
  {
    id: 'random',
    title: 'random',
    subtitle: 'Pseudo-random selection',
    description:
      'Used to select one unpredictable word from the predefined pool each time a new game starts.',
    snippet: `import random\nsecret_word = random.choice(words)`,
    roleInGame:
      'Ensures every game session is fresh and non-deterministic without needing external files or network calls.',
  },
  {
    id: 'while-loop',
    title: 'while loop',
    subtitle: 'Indefinite repetition',
    description:
      'Controls the main game loop, continuing while incorrect guesses are below 6 and the word has unrevealed letters.',
    snippet: `while incorrect_guesses < max_incorrect and not is_won:\n    # prompt, validate, update state`,
    roleInGame:
      'Unlike a fixed `for` loop, a `while` loop continues for an unknown number of turns determined by user guesses.',
  },
  {
    id: 'if-else',
    title: 'if-else',
    subtitle: 'Conditional decision branching',
    description:
      'Evaluates user input validity, checks whether a letter exists in the secret word, and determines victory or loss.',
    snippet: `if guess in secret_word:\n    print("Correct!")\nelse:\n    incorrect_guesses += 1`,
    roleInGame:
      'Branches the application flow based on game rules (duplicate check, alphabet validation, win/loss triggers).',
  },
  {
    id: 'strings',
    title: 'strings',
    subtitle: 'Character manipulation & masks',
    description:
      'Handles word casing, input sanitization (`.strip().upper()`), masked display with underscores, and letter containment checks.',
    snippet: `display_word = " ".join([c if c in guessed else "_" for c in word])`,
    roleInGame:
      'Represents secret words and the visual puzzle `_ _ P _ _`, as well as parsing typed letter commands.',
  },
  {
    id: 'lists',
    title: 'lists',
    subtitle: 'Ordered mutable collections',
    description:
      'Stores the pool of 5 predefined candidate words and collects all letters guessed by the player so far.',
    snippet: `words = ["PYTHON", "HANGMAN", "VARIABLE", "COMPUTER", "ALGORITHM"]\nguessed_letters.append(guess)`,
    roleInGame:
      'Tracks history of guesses to prevent duplicate penalties and allows iterative validation against candidate words.',
  },
];
