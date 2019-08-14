# Convex

// Program Startup Instructions :

Start program by opening the file /src/index.html in your browser, 

if this does not work :
then use Node.js, modify the working directory const ROOT = "C:/Users/clmcr/WebstormProjects/Convex/src"; appropriately in the file ‘server.js’

Then cd to \Convex and run the command ‘node server.js’, then in your browser type ‘localhost:9091’ in the url bar and press enter.
____________________________________________________________________________


Area.js defines a Class ‘Area’ and various non-member helper methods.  This class acts as a graph; contents may be added to it and will have their position with respect to its origin (Area.Base).  The Area Class also allows for the optional toggling of grid, axes and box boundary graphics.  This Class has been implemented with the sole purpose of streamlining the creation of relative origins of 3D objects (THREE.js Object3Ds), so that management of the positions of larger systems of/or graphical objects can be made trivial.

In Implementation, Areas are placed using the cube placer which places Areas in a spiral.  This is used to position user added functions for Descent optimization, and to position the Descent area and the Simplex Area, and allow for future areas to be added with ease, and in a streamlined manner.

BackBone.js implements with asynchrony (using the library ‘asynquence’ which combines sequences with promises for easy chaining; this will be useful to convex later in this paper) the necessary steps to create an initial THREE.js Scene for 3D graphical programming.  Features include : VR capability (as a freebie, requires a few additional lines to be activatable, however these lines are trivial but did not serve a purpose for this project), a Perspective Camera (non Orthographic), Controls for moving and looking in the 3D scene, responsive resizing and readjusting with respect to inner window size, and the necessary baseline components to begin rendering a THREE.js Scene.

I imported one external math library and made absolute minimal use of it, namely math.js.  It is used in the following ways : 
(DynamicDescent.js) to compute -∇2f(x)-1∇f(x) by solving the linear system :
∇2f(x) y = -∇f(x) for y.  This is done through the use of ‘math.lusolve(A,b)'.
(Simplex.js) Used to eliminate redundant code to multiply a vector by -1

InputHandling.js defines a number of helpful systems for the capturing of user input, as well as makes a substantial improvement to the default camera/control movement of the THREE.js OrbitControls (which I thought was a relevant addition as this package is based in an interactive 3D environment)

Sugar.js defines a layer of syntactic sugar on top of both Javascript and THREE.js.  Despite the fact that it does not pertain to Convex Optimization, I wish to elaborate on some of it as it plays an important and significant role in the code.  

-- It is at this point that it seems relevant to describe the various decisions made in the metastructure of my code.  Observe that many methods have a single parameter ‘w’ which is an object.  As a result of the convenience of Javascript objects, it must be noted that the use of this object as the sole parameter to most functions is a powerful and necessary tool in supporting the programming of highly dynamic systems and algorithms.  Dynamic parameterization of methods is the key to dynamic parameterization of algorithms. By following this paradigm, one needs not worry about parameter order, and can write modular code which deals with many parameters very succinctly, and further can write meta-structural code dynamic on the number, name and order of parameters. 

This paradigm is then combined with the effective use of OOP to reduce redundancy of code, increase readability, induce further structure and soft modularity, and facilitate the succinct implementation of complex dynamic systems and algorithms.
 --

‘dod’ aka ‘defined or default’ is a sugar method which takes an object (generally a ‘w’) a field name and a default value, if the object has the field defined then it returns the respective value, otherwise it returns the specified default value. (it is defined in  Symbolic.js)


Symbolic.js defines the math evaluator and differentiator I built from the ground up to represent and manipulate mathematical functions in this package.  Formulae are in the form described by First-Order-Logic, are stored symbolically, as instances of the Term class.  These terms are tagged with a string defining the main operator of the formula, and the sub-formulae or atomic objects.  A Term is evaluated as in First-Order-Logic by lazily applying its main operator to the recursive evaluation of its sub-formulae 1.  The Terms can be differentiated through symbolic differentiation by the derive method; which also takes as a parameter the variable whom with respect to derive. The gradient method takes an array of Terms and set of variable names and creates the resulting gradient vector.

DescentOptions.js defines a set of buttons and input listening protocols that allow the user to customize the following parameters for Descent : initial point, epsilon for Newton’s Method, a precision parameter for Gradient Descent’s check for optimality (to reduce computation load greatly, and reduce the clutter of graphical objects that would otherwise occur near the optimum), alpha, beta, and whether to use backtracking line search (options.line_search = ‘back’), or use Newton's Method for line search (options.line_search = ‘newton’).

SceneSettings.js defines a set of Classes uses to build up to the LinearOptimization class which conglomerates the storage and positioning of constraints and an objective function for a Linear Program.  In order to change the Objective Function visual graphic, the client must manually change the parameter ‘objective’ to the desired THREE.js Object3D on line 140 (linopt = new LinearOptimization({size : 500, objective : con});)
Construction of a custom LinearOptimization object should follow the same syntax as above, and the addition of constraints takes the following syntactical form : (Generally how to use the methods in this package is a trivial inference based off the field names (ie ‘normal’ is the normal vector of the plane and ‘centroid’ is the point with which to define the plane))
linopt.addConstraint({normal : new THREE.Vector3(0,1,0), centroid : new THREE.Vector3(0,0,0)});


EquationBuilder.js 
This file creates the functionality that allows the user to input a function using the interface component located in the bottom left of the screen, which upon ‘submit’ is graphed visually, and added to the descent graphs seen, and may have all the descent algorithms performed on it.  Note on button use : press ‘xyz’ then a letter or ‘123’ then a single digit number (sorry)

Program.js
This file just creates the initial Areas and examples

DynamicDescent.js
The DynamicDescent class is ‘Abstract’ in nature.  It is dynamic on an optimality check method, a function, a line search method, a visit function called on each successive descent, a step direction computing method and a step distance computing method.  It implements a method ‘descend’ which, dynamic on what the class is dynamic on with the addition of the starting point, performs descent by performing the following algorithm
If current point optimal, visit and return else goto 2
Compute the step direction and distance, visit, if the perspective descent improves the point, then update the point with the direction and distance and go back to 1, else return the current point.

The DynamicGradientDescent class fulfills the optimality check method and step direction computing method of the DynamicDescent class which it implements, remaining dynamic on the line search method and step distance computing method, and is dynamic as described previously on a user definable precision parameter.  The class fulfills these methods appropriately and succinctly to perform steepest descent.

The DynamicNewtonsMethod class fulfills the optimality check method and step direction computing method of the DynamicDescent class which it implements, remaining dynamic on the line search method and step distance computing method.  The class fulfills these methods appropriately and succinctly to perform Newtons Method.


The DynamicAnimatedDescent method wraps a visit function, animating descent on the visual function, placing tangent places, gradient vectors, newton direction vectors, and the
q(y) = f (x) +∇f (x)T(y−x) + (½)(y−x)T∇2f (x)(y−x) quadratic function at each point in the descent.  It accomplishes the animation without blocking computation by appending the animation steps to a promise chain and returning to computation immediately.
This method also creates the functionality to have the camera follow the descent algorithm, and makes this better by using lagrange interpolation combined with the step directions and some averaging. 

The lagrangian_interpolation method performs lagrangian interpolation dynamic on all possible parameters, useful for the Descent Animation.

The backtracking line search method performs backtracking line search dynamic on all possible parameters and required no modifications due to Armijos stopping rule

The newtons method for line search method performs newtons method for line search dynamic on all possible parameters.  It required a modification to the stopping rule. Checking if the gradient is close to zero dynamic on the definition of close, rather than equal to zero, reducing the number of necessary and visually indicated descent steps from 1300 on average for the default descent examples to under 10.  This can be removed to facilitate computational accuracy by setting precision = 0.

The rest of the methods in this file make setting up a descent easier and deals with various graphical and interface components.




Simplex.js defines a single class LP which when parameterized in the follow form : 
let l = new LP({
 num : 3,
 b : [
   1,5,4,5
 ],
 positives : (() => {
   let set = new Set();
   set.add(1);
   set.add(2);
   return set;
 })(),
 c : [
   -1, -2, -3
 ],
 isMax : false,
 equalities : [
   [1,1,-1],
 ],
 inequalities : [
   [2,-1,-2],
   [1,-1,0],
   [0,1,1]
 ]
});
Allows the running and display* of the Simplex Algorithm dynamic on all possible parameters : variables, inequalities, equalities, objective function, whether max or min, and the variables which are >= 0.
For the constraints, input as a matrix of coefficients as seen above.  Place the bis in the b array accordingly.
The objective function (c) should be an array of coefficients as seen above.
Calling the constructor with the parameters immediately runs the simplex algorithm.  The tableaus, basic variables and their values can be stepped through with the back and forth buttons that laterally flank the tableau text graphic.

The algorithm performs the following steps :
Induce necessary slack variables and u-v variables to put the LP in standard form
Form the initial tableau and select basic variables
While there exists negative relative costs, pivot by finding the column with the most negative relative cost and the row with the highest ratio of the element at the cross between the row and column and the element in the far right column of that row.  Update the tableau using row ops to transform the leaving variable’s column into the appropriate standard basis vector.  Repeat 3. Else if there are no negative relative costs, the current solution is optimal.
Throughout this algorithm, the class keeps track of the basic and non-basic variables, the values of the variables and creates relevant graphical objects to display this information.  It also creates the ability to step back and forth through the tableaus and also shows* the path which the algorithm took visually.

*Due to being restricted to 3 dimensions, and the cumbersome nature of placing the planes, the graphic is off and can behave strangely if more than 3 variables are used.  However if 3 variables are used, then the graphical red line is correct, and the planes (may be slightly off and ) show the concept of how the domain is restricted to the intersection and the objective function is overlayed to help guide the visualization that the resulting restricted domain is then mapped to said function.


Interface description :

Bottom Left : entering interface for Descent Functions

Bottom Right : two buttons for changing location, the left button brings you to the Simplex area, the right button brings you to the Descent area.

Above Bottom Right : buttons to control various settings for Descent, press backtracking for Backtracking line search, press Newton for Newton’s method for line search, press alpha/beta, then a string of numbers to set alpha/beta to  0.(string of numbers), press epsilon/precision then a string of numbers to set epsilon/precision to that string of numbers (better for those to just set manually by changing their values in ‘options’ at the top of DescentOptions.js), press point then 3 numbers to set the initial point to those three numbers, press the newt-dir, grad-dir, quadratic, or tan plane buttons to toggle whether the newton-direction vector, gradient direction vector, q(y) = f (x) +∇f (x)T(y−x) + (½)(y−x)T∇2f (x)(y−x) quadratic function, or tangent plane are seen at every descent step.

Above ‘Above Bottom Right’ : the tableau graphic has two buttons that traverse you chronologically through the tableaus used in the last simplex algorithm run.  Right arrow brings you closer to the final optimal tableau, left arrow bring you closer to the starting tableau.




Center : Top yellow button toggles whether the camera should follow close in on the descent trace.  Green button, 2nd to top performs a Steepest Descent trace on the function.  Blue button 2nd to bottom focuses the camera and controls on this area.  Bottom grey button performs Newton’s Method for descent.

