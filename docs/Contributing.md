***Any contribution helps our team and makes Tasmota better for the entire community!***

You can contribute by:

- providing Pull Requests (Features, Proof of Concepts, Language files or Fixes)
- testing new released features and report issues
- [donating](https://paypal.me/tasmota) to acquire hardware for testing and implementing or out of gratitude
- contributing documentation for features and devices
- submitting [new device templates](https://templates.blakadder.com/new.html) 
- fixing spelling mistakes, broken links and other errors in the documentation
- writing guides on wiring and using sensors or your DIY projects featuring Tasmota

## Editing Articles

!!! failure "You need a GitHub user account to be able to edit"

If you spot an error in an article use the *pencil icon* link at the top of the page, near the title, to correct it. This version of documentation uses strict markdown syntax with some enhancements. See [Markdown Cheatsheet](https://3os.org/markdownCheatSheet/welcome/) for all features

You'll be taken to the GitHub repository page of that file, after a "fork" (copy) of the docs are made into your own GitHub account.

![Edit file](_media/pr_tutorial_1.png)

Click on the **edit** button (pencil icon). Edit/Add the text you wanted. When finished find the **Propose changes** button at the bottom and click it.

![Propose file change](_media/pr_tutorial_2.png)

Next you need to click **Create pull request** which is GitHub speak for propose changes.
![Create pull request](_media/pr_tutorial_3.png)

In the PR window add a small description of what you did and click **Create pull request**
![Create pull request](_media/pr_tutorial_4.png)

Now you wait for one of the Tasmota admins to approve your PR (or deny :smiling_imp:, no guarantees!) 

_**Congratulations**_! 

You've made a contribution to the Tasmota project making it a better experience for all future users. Thank you!

## Adding devices to the documentation
If you're adding a new page, go to [documentation GitHub](https://github.com/tasmota/docs/tree/master/docs) and click **Create new file**, name the file with .md extension.

## Doc Cookbook

On top of standard Marksown, the documentation is using standardized presentations:

### Note and warning

!!! note   
    You can insert a 'note' like this one with the following code.
```haskel
!!! note
    You can insert a 'note' like this one with the following code.
```

!!! warning  "Warning with title in bold"
    You can insert a 'warning' like this one with the following code.<br>
    Also you can have a text in bold in the title by using quotes.
```haskel
!!! warning  "Warning with title in bold"
    You can insert a 'warning' like this one with the following code.<br>
    Also you can have a text in bold in the title by using quotes.
```

Other possibilities include :

!!! example
    Use `!!! example`

!!! info
    Use `!!! info`

!!! tip         
    Use `!!! tip`

!!! failure     
    Use `!!! failure`

In places where it is not possible ot insert a block, like in tables used in 
`Commands.md`, you can use an Emoji :

* :pencil: **Note:** Use `:pencil: **Note:** `
* :warning: **Warning:** Use `:warning: **Warning:** `
* :page_facing_up: **Example:** Use `:page_facing_up: **Example:** `
* :information_source: **Info:** Use `:information_source: **Info:** `
* :fire: **Tip:** Use `:fire: **Tip:** `
* :x: **Failure:** Use `:x: **Failure:** `
