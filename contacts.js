const { rejects } = require('assert');
const { promises } = require('dns');
const fs = require('fs');
const { resolve } = require('path');
const chalk = require('chalk');
const validator = require('validator');
// const readline = require('readline');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdin

// });

// membuat folder jika tidak ada
const dirPath = './data';
if(!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
};

// membuat file jika tidak ada
const dataPath = './data/contacts.json';
if(!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8');
};

// const tulisPertanyaan = (pertanyaan) => {
//     return new Promise((resolve, rejects) => {
//         rl.question(pertanyaan, (nama) => {
//             resolve(nama);
//         });        
//     });
// };
const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
    const contacts = JSON.parse(fileBuffer);
    return contacts;
}
const simpanContact = (nama, email, noHP) => {
    
    const contact = { nama, email, noHP };
    // const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
    // const contacts = JSON.parse(fileBuffer);

    const contacts = loadContact;

    // cek duplikat 
    const duplikat = contacts.find((contact)=> contact.nama === nama);
    if(duplikat) {
        console.log(
            chalk.red.inverse.bold
            ('Contact sudah terdaftar , gunakan nama lain !!'));
        return false;
    };

    // cek email

    if(email) {
        if(!validator.isEmail(email)) {
            console.log(
                chalk.red.inverse.bold
                ('Email tidak valid !!'));
            return false;
        }
    }
// cek no HP
    if(!validator.isMobilePhone(noHP, 'id-ID')) {
        console.log(
            chalk.red.inverse.bold
            ('nomor HAPE tidak valid!!'));
        return false;
    }

    contacts.push(contact);

    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
    console.log(
        chalk.green.inverse.bold
        ('terima kasih sudah memasukkan data'));
    
}

const listContact = () => {
    const contacts = loadContact();
    console.log(chalk.cyan.inverse.bold('Data Contact :  '));
    contacts.forEach((contact, i) => {
        console.log(`${i+1}. ${contact.nama} - ${contact.noHP}`);
    });
};

const detailContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find(
        (contact) => contact.nama.toLowerCase() === nama.toLowerCase())

    if(!contact) {
        console.log(chalk.red.inverse.bold(`${nama} tidak ditemukan`));
        return false;
    }

    console.log(chalk.cyan.inverse.bold(`${contact.nama}`));
    console.log(contact.noHP);
    if(contact.email) {

        console.log(contact.email);
    }
};

const deleteContact = (nama) => {
    const contacts = loadContact();
    // kita bukan menghapus tapi membuat array baru kecuali yang dipanggil
    const newContacts = contacts.filter(
        (contact) => contact.nama.toLowerCase() !== nama.toLowerCase()
        );

    if(contacts.length === newContacts.length) {
        console.log(chalk.red.inverse.bold(`${nama} tidak ditemukan`));
        return false;
    }
    
    fs.writeFileSync('data/contacts.json', JSON.stringify(newContacts));
    console.log(
        chalk.green.inverse.bold
        (`data contact ${nama} berhasil dihapus!`));
    
};

module.exports = {
   simpanContact, listContact, detailContact, deleteContact
};