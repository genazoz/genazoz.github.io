<?php

    $name = $_GET['name'];
    // $phone = $_GET['phone'];
    $email = $_GET['email'];
    $message = $_GET['message'];

    $themeFieldset = "";
    $theme = "Посетитель genazoz.ru";
    $nameFieldset = "Привет! Меня зовут ";
    // $phoneFieldset = "Мой телефон ";
    $emailFieldset = "Мой email: ";
    $txt = "";
    $messageFieldset = "Сообщение: ";
    $arr = array(
        $themeFieldset => $theme,
        $nameFieldset => $name,
        $emailFieldset => $email,
        // $phoneFieldset => $phone,
        $messageFieldset => $message,
    );
    foreach($arr as $key => $value) {
        $txt = $txt."<b>".$key."</b> ".$value."%0A";
    };
    $token = "736130423:AAEglGNMWe5TOwBBsLw-DGl8Vlqf8ovz4Ts";
    $chat_id = "735789180";
    $sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");
    echo '1';
?>