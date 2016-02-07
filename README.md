# Welcome to Squire!
Squire is a Chrome extension that utilizes Google's Web Speech API to make it super easy to enable/create voice commands for various browser tasks. In addition, to the many built-in commands Squire offers, users can also define their own voice commands that can be bound to multiple user-defined actions.


## Inspiration
A little bit of SlackBot, a little bit of Cortana, a lot of hacking around. We all felt that the browser needed some type of approachable "shell" to help reduce the amount of navigation it takes for simple tasks. Furthermore, we feel that Squire can help improve many disabled users' experience while browsing the Internet.


## How we built it
JavaScript, Angular.JS, HTML5, CSS3, Google Web Speech API, Chrome Extension

## Challenges we ran into
* Various issues with the asynchronous nature of JS. 
* Angular scope issues between dialogues and Squire page.
* Accomplishing various Chrome browser tasks through a background JS process.

## Accomplishments that we are proud of
We created something that has a lot of utility for people.

## What we learned
* Chrome extensions

### Usage
| Command       | Action                   | Example            |
| ------------- |:------------------------:| --------------:|
| `open <arg>`        | opens url          | `open abc.xyz` |
| `close tab`       | closes current tab               | `close`|
| `close all`       | closes all tabs               | `close all`|
| `close <arg.com>`       | closes \*://\*.arg.com/\*               | `close google.com`|
| `new`         | opens new tab          | `new`        |
| `say`         | speech to speech         | `say hello world` |
| `search`      | searches google           | `search big cats`  |
| `read`        | text to speech selection | `read`         |
| `copy`        | copies selection           | `copy`         |
| `cut`         | cuts selection            | `cut`          |
| `paste`       | pastes selection          | `paste`        |
| `amazon`      | searches amazon           | `amazon toys`  |
| `reddit`      | searches reddit           | `reddit cats`  |

## What's next for Squire
More functionality and eventually on get on the chrome web store!

### Authors and Contributors
Derek Hua (@derekhua), Jesse Chau (@JChauster), and Xin He (@xin-he).
