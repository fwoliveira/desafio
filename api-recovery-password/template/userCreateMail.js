exports.userCreateMailTemplate = (data) => {
    var mailBody = "";
            mailBody += '<div style="background-color:#000; margin-bottom:150px;">';
            mailBody += '<div style="margin-top:150px;">';
            mailBody += '<p style="color:#fff; font-weight:bold;margin-top:50px;">';
            mailBody += 'Olá ';
            mailBody += '</p>';
            mailBody += '<p style="color:#fff; font-style:italic;margin-top:50px;">';
            mailBody += 'Segue o link para alterar sua senha !';
            mailBody += '</p>';
            mailBody += '<p style="color:#fff;margin-top:50px;">';
            mailBody += '</p>';
            mailBody += '<p style="color:#fff;margin-top:50px;">';
            mailBody += 'Codigo: {passwordtoken}';
            mailBody += '<p><a style="color=#fff;" margin-top:50px; href="http://127.0.0.1:5173/recoverypassword">Alterar senha</a></p>  '
            mailBody += '</p>';
            mailBody += '</div>';
            mailBody += '</div>';
            mailBody = mailBody.replace('{name}', data.name);
            mailBody = mailBody.replace('{email}', data.email);
            mailBody = mailBody.replace('{passwordtoken}', data.token);

            return mailBody;
}

