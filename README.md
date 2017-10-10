# POC by Diego Acosta

## Technical decissions/comments

- The file structure used for the app is probably unnecessary for this "size" of apps, but for the sake of showing what I usually do, I chose to organize the files with a "module" approach. I believe this structure allows the app to scale by not having a one folder per type of file (views, controllers, directives, etc). Also, it makes it more modular allowing the reuse of the modules.

- A couple of things that are still NOT prod-ready are, for example: the code in the controller to invoke the popup, the directive used for the amount input (a bit buggy in my opinion) or the watch statement I added to the amount property. 
    - For the popup we could've used the directive but it didn't have an option to disable the popup (needed when the amount is not valid). We could've done a directive on our own or a service so the code to open a popup doesn't repeat all over the app.
    - For the amount input formatting, in the future, we can use directive that does the formatting and also allows you to add validations - far more customizable (max, min, prefix symbol, etc)
    - That ugly watch on the amount property would have been avoided with the right directive

- The gulp task code is far from ideal but is good enough for this purpose.