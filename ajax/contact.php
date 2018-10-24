<?php

require '../vendor/autoload.php';

use Mailgun\Mailgun;

if (isset($_POST)) {

    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    $type = $_POST['type'];

    $html = 'You have a new form submission. <br><br>';
    $html .= '<h1>'.$type.'</h1>';
    $html .= '<strong>Name: </strong>' . $name . '<br>';
    $html .= '<strong>Email: </strong>' . $email . '<br>';
    $html .= '<strong>Message: </strong>' . $message . '<br>';
    
    # First, instantiate the SDK with your API credentials
    $mg = Mailgun::create('key-9793adf968a4fb57cc6f619b58b98d4c');

    # Now, compose and send your message.
    # $mg->messages()->send($domain, $params);
    $result = $mg->messages()->send('idevia.in', [
    'from'    => 'no-reply@idevia.in',
    'to'      => 'mortuzalam@gmail.com',
    'subject' => 'Mail From Website',
    'text'    => 'You mail does not support HTML.',
    'html'    => $html
    ]);

    if ($result) {
        echo json_encode(['error' => false, 'msg' => $html]);
    } else {
        echo json_encode(['error' => true]);
    }
}

