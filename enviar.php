<?php
  $nome = $_POST['nome'];
  $telefone = $_POST['telefone'];
  $email = $_POST['email'];
  $mensagem = $_POST['mensagem'];
  $data_envio = date('d/m/Y');
  $hora_envio = date('H:i:s');

  // Corpo do e-mail
  $arquivo = "
    <html>
      <p><b>Nome: </b>$nome</p>
      <p><b>Telefone: </b>$telefone</p>
      <p><b>E-mail: </b>$email</p>
      <p><b>Mensagem: </b>$mensagem</p>
      <p>Este e-mail foi enviado em <b>$data_envio</b> às <b>$hora_envio</b></p>
    </html>
  ";

  // Destinatário e assunto
  $to = "gustavoyoshizawa89@gmail.com";
  $assunto = "Contato pelo Site";

  // Headers
  $headers  = "MIME-Version: 1.0\n";
  $headers .= "Content-type: text/html; charset=iso-8859-1\n";
  $headers .= "From: $nome <$email>";

  // Enviar e-mail
  mail($to, $assunto, $arquivo, $headers);

  // Redirecionar após envio
  header('Location: /contato.html');
  exit();
?>
