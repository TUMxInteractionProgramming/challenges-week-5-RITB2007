/* start the external action and say hello */
console.log("App is alive");


/** #7 Create global variable */
var currentChannel;

/** #7 We simply initialize it with the channel selected by default - sevencontinents */
currentChannel = sevencontinents;

/** Store my current (sender) location
 */
var currentLocation = {
    latitude: 51.484441, 
    longitude: 4.454181,
    what3words: "lakwerk.peetoom.getoond"
};

/**
 * Switch channels name in the right app bar
 * @param channelObject
 */
function switchChannel(channelObject) {
    //Log the channel switch
    console.log("Tuning in to channel", channelObject);

    // #7  Write the new channel to the right app bar using object property
    document.getElementById('channel-name').innerHTML = channelObject.name;

    //#7  change the channel location using object property
    document.getElementById('channel-location').innerHTML = 'by <a href="http://w3w.co/'
        + channelObject.createdBy
        + '" target="_blank"><strong>'
        + channelObject.createdBy
        + '</strong></a>';

    /* #7 remove either class */
    $('#chat h1 i').removeClass('far fas');

    /* #7 set class according to object property */
    $('#chat h1 i').addClass(channelObject.starred ? 'fas' : 'far');


    /* highlight the selected #channel.
       This is inefficient (jQuery has to search all channel list items), but we'll change it later on */
    $('#channels li').removeClass('selected');
    $('#channels li:contains(' + channelObject.name + ')').addClass('selected');

    /* #7 store selected channel in global variable */
    currentChannel = channelObject;
}

function addNewChannel() {
    //#10  clear all messages #clear
    $('#messages').empty();
    //#10  input new channels name #name
    $('#messages-app-bar').hide();
    $('#new-channel-app-bar').show();
    //#10 change send button ceate button
    $('#send-button').hide();
    $('#create-button').show();
}

function abortCreateChannel() {
    //#10  cose the new channels name app bar
    //#10  open messages app bar
    $('#new-channel-app-bar').hide();
    $('#messages-app-bar').show();
    //#10 change create button send button
    $('#create-button').hide();
    $('#send-button').show();
}

/* liking a channel on #click */
function star() {
    // Toggling star
    // #7 replace image with icon
    $('#chat h1 i').toggleClass('fas');
    $('#chat h1 i').toggleClass('far');

    // #7 toggle star also in data model
    currentChannel.starred = !currentChannel.starred;

    // #7 toggle star also in list
    $('#channels li:contains(' + currentChannel.name + ') .fa').removeClass('fas far');
    $('#channels li:contains(' + currentChannel.name + ') .fa').addClass(currentChannel.starred ? 'fas' : 'far');
}

/**
 * Function to select the given tab
 * @param tabId #id of the tab
 */
function selectTab(tabId) {
    $('#tab-bar button').removeClass('selected');
    console.log('Changing to tab', tabId);
    $(tabId).addClass('selected');
}

/**
 * toggle (show/hide) the emojis menu
 */
function toggleEmojis() {
    $('#emojis').toggle(); // #toggle
    loadEmojis(); // load emojis onclick
}


//* #10 more #suitable way to load emojis, can be used in body onload
function loadEmojis() {
    var emojis = require('emojis-list');
    $('#emojis').html(emojis);
}

/**
 * #8 This #constructor function creates a new chat #message.
 * @param text `String` a message text
 * @constructor
 */
function Message(text) {
    // copy my location
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    // set dates
    this.createdOn = new Date() //now
    this.expiresOn = new Date(Date.now() + 15 * 60 * 1000); // mins * secs * msecs
    // set text
    this.text = text;
    // own message
    this.own = true;
}

function sendMessage() {
    // #8 Create a new message to send and log it.
    //var message = new Message("Hello chatter");

    // #8 let's now use the real message #input
    var message = new Message($('#message').val());
    console.log("New message:", message);

    // #10 Don't send empty message
    if (message.text.length > 0 ) {

    // #8 convenient message append with jQuery:
    $('#messages').append(createMessageElement(message));
    // #10 the message into the channel array #push
    currentChannel.messages.push(createMessageElement(message));
    // #10 increas the message count #increase
    currentChannel.messageCount = currentChannel.messageCount + 1;

    // #8 messages will scroll to a certain point if we apply a certain height, in this case the overall scrollHeight of the messages-div that increases with every message;
    // it would also scroll to the bottom when using a very high number (e.g. 1000000000);
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));

    // #8 clear the message input
    $('#message').val('');

    }
    else alert ("You have nothing to send!")
}

/**
 * #8 This function makes an html #element out of message objects' #properties.
 * @param messageObject a chat message object
 * @returns html element
 */
function createMessageElement(messageObject) {
    // #8 message properties
    var expiresIn = Math.round((messageObject.expiresOn - Date.now()) / 1000 / 60);

    // #8 message element
    return '<div class="message'+
        //this dynamically adds the class 'own' (#own) to the #message, based on the
        //ternary operator. We need () in order to not disrupt the return.
        (messageObject.own ? ' own' : '') +
        '">' +
        '<h3><a href="http://w3w.co/' + messageObject.createdBy + '" target="_blank">'+
        '<strong>' + messageObject.createdBy + '</strong></a>' +
        messageObject.createdOn.toLocaleString() +
        '<em>' + expiresIn+ ' min. left</em></h3>' +
        '<p>' + messageObject.text + '</p>' +
        '<button class="accent">+5 min.</button>' +
        '</div>';
}


function listChannels(criterion) {
    // #8 channel onload
    //$('#channels ul').append("<li>New Channel</li>")
/*
    // #8 five new channels
    $('#channels ul').append(createChannelElement(yummy));
    $('#channels ul').append(createChannelElement(sevencontinents));
    $('#channels ul').append(createChannelElement(killerapp));
    $('#channels ul').append(createChannelElement(firstpersononmars));
    $('#channels ul').append(createChannelElement(octoberfest));
    */

    // #10 sort the channel array
    if (criterion == "new") {
        channels.sort(compareNew);
    } else if (criterion == "trending") {
        channels.sort(compareTrending);
    } else if (criterion == "favorites") {
        channels.sort(compareFavorites);
    } 

    // #10 list channels #for
    var i;
    $('#channels ul').empty();
    for (i=0;i<channels.length;i++) {
        $('#channels ul').append(createChannelElement(channels[i]));
    }
}
    

// #10 create three comare functions #compare

// compare base on creation time
function compareNew (a, b) {
    var dateA=new Date(a.createdOn), dateB=new Date(b.createdOn)
        return dateB-dateA
    }

// compare base on message count
function compareTrending (c,d) {
    return d.messageCount > c.messageCount ? 1 : c.messageCount > d.messageCount ? -1 : 0;
    }

// compare base on stars
function compareFavorites (e,f){
    return (e.starred===f.starred) ? 0 : e.starred? -1 : 1;
}

   

/**
 * #8 This function makes a new jQuery #channel <li> element out of a given object
 * @param channelObject a channel object
 * @returns {HTMLElement}
 */
function createChannelElement(channelObject) {
    /* this HTML is build in jQuery below:
     <li>
     {{ name }}
        <span class="channel-meta">
            <i class="far fa-star"></i>
            <i class="fas fa-chevron-right"></i>
        </span>
     </li>
     */

    // create a channel
    var channel = $('<li>').text(channelObject.name);

    // create and append channel meta
    var meta = $('<span>').addClass('channel-meta').appendTo(channel);

    // The star including star functionality.
    // Since we don't want to append child elements to this element, we don't need to 'wrap' it into a variable as the elements above.
    $('<i>').addClass('fa-star').addClass(channelObject.starred ? 'fas' : 'far').appendTo(meta);

    // #8 channel boxes for some additional meta data
    $('<span class="primary">').text(channelObject.expiresIn + ' min').appendTo(meta);
    $('<span class="primary">').text(channelObject.messageCount + ' new').appendTo(meta);

    // The chevron
    $('<i>').addClass('fas').addClass('fa-chevron-right').appendTo(meta);

    // return the complete channel
    return channel;
}

    // #10 constructor function for a channel
    function Channel(text) {
        this.name = text;
        this.createdOn = new Date(); //now
        this.createdBy = currentLocation.what3words;
        this.starred = false;
        this.expiresIn = 100; //arbitrary number for now
        this.messageCount = 0;
        this.messages = [];
    };

function createChannel() {
     // build the channel object
    var channel = new Channel($('#new-channel-name').val())

    var message = new Message($('#message').val());
    
    // #10 check mesages validation before sending
    if (channel.name.length == 0) {
        alert("Enter channel name starting with #");
        } 
        else if (channel.name[0] != '#') {
        alert("Your channel name must start with #");
        }
        else if (channel.name.indexOf(' ') >= 0 ){
        alert("Your channel contains spaces"); 
        }
        else {
        // make the channel the current one
        currentChannel = channel;
        // add the channel to the channels array
        channels.push(currentChannel);
        // send the message
        sendMessage();
        // reset the app bars and buttons
        abortCreateChannel();
        // refresh the channel list
        listChannels(compareNew);
        // refrest the top-right-app bar with the new channel
        switchChannel(currentChannel);

       }
    }


