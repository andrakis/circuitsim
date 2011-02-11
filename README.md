CircuitSim
==========

Aims to be a graphical frontend to creating circuits that can be simulated using JavaScript.
Design your circuit using drag-and-drop (via jQuery UI) and linking items together.

A plugin system allows for you to write your own objects and give them custom logic, rendering and actions.

For a look at the old text-only system, see the old_text subdirectory.


Text-Only System
================
Located in the old_text directory is a html file, circuits.html, which contains the logic for the old system.
A sample circuit is provided, and more are available in the circuits subdirectory. Simply copy the contents of one of the files into the buffer at the top of circuits.html code window and press Update.

Logic is rather simple - an item has current, or does not have current. When an item has its current changed, it looks at its neighbour map, according to the symbol used (different symbols have different output and input maps), and by default sets each neighbour with the same current it receieved.
Some symbols have special meanings, being logic gates or a battery.

A battery ( *, or a number ) can be clicked to provide power to every item surrounding it.

There are many special symbols - some simply control direction, others take multiple inputs and provide a specific output, and some act as bridges that will allow you to have current "jump" over a line.

