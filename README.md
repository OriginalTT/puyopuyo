# Tetris Game Project

This is a project where I implemented the classic game of Tetris using JavaScript. The game features a dynamic grid and supports all the classic Tetris movements: move down, move left, move right, and rotate.

## Technologies Used

- JavaScript
- HTML
- CSS
- p5.js

## Key Features

- **Dynamic Grid:** The game dynamically creates a grid according to the specified number of rows and columns.

- **Tetromino Movement:** Users can control tetrominoes using keyboard input. This includes moving the pieces down, to the left, to the right, and rotating them.

- **Line Clearing:** When a horizontal line is filled with blocks, it is cleared and the blocks above move down.

- **Game Over Detection:** The game detects when the stack of blocks has reached the top of the grid, ending the game.

- **Collision Detection:** The game prevents pieces from moving through each other and the walls of the grid.

## Challenges and Learning Outcomes

Implementing the Tetris game was a fun but challenging task. It required a good understanding of JavaScript, especially in terms of handling keyboard events and manipulating 2D arrays. It also involved understanding how to implement game logic and detect collisions.

I learned how to effectively handle keyboard events to provide a smooth user experience. I also enhanced my problem-solving skills, particularly in dealing with multi-dimensional arrays and game logic.

One of the key challenges I faced was implementing the rotation of tetrominoes. It was tricky to handle rotations near the boundaries of the grid or other tetrominoes. I solved this by checking if the rotation is possible before executing it.

## Future Improvements

- **Score System:** Implement a scoring system where the user gains points for clearing lines.

- **Levels:** Implement levels in the game. The speed of falling tetrominoes could increase with each level.

- **Multiplayer:** Explore the possibility of a multiplayer version of the game.

## How to Play

The game can be played using the following keys:
- Arrow up: Rotate the piece.
- Arrow left: Move the piece to the left.
- Arrow right: Move the piece to the right.
- Arrow down: Speed up the piece's fall.

## Acknowledgements

I used GPT-4 to work on this project. 
All sounds used in this project is copyright free. The sounds can be found on https://soundeffect-lab.info/.