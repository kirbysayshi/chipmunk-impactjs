
Chipmunk-js for ImpactJS
========================

This plugin for ImpactJS provides a basic entity and game (main) class to use [Chipmunk-js](https://github.com/josephg/Chipmunk-js). ImpactJS comes with a Box2d plugin, but I wanted to try out Chipmunk.

[Chipmunk](http://chipmunk-physics.net/release/ChipmunkLatest-Docs/) has great docs that help with understanding how it works.

Demo
----

A demo is available for play at https://dl.dropbox.com/u/52514/games/impact-chipmunk/index-desktop.html. It is the Impact Box2D "Jump n Run" demo, using Chipmunk. The demo code (entities, world) is included in the `lib/game` folder of this repo.

Debug Panel
-----------

There is currently a basic debug panel that can:

* Draw Chipmunk entities
* Highlight the collision rectangles generated from Impact's collision map

Missing
-------

Chipmunk has support for a TON of other things, like circles, joints, constrants, and more. Think of this "plugin" as an example of how to get started, as opposed to a complete solution.

Issues
------

Things in the demo are a little squishy, and I'm not sure why. I've asked for help on the Chipmunk forums, but if you have ideas, pull requests are welcome!

LICENSE
-------

Copyright (C) 2012 
Andrew Petersen <senofpeter@gmail.com>
portions Dominic Szablewski <dominic.szablewski@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.	

