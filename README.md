
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

