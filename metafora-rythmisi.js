/* ΦωτοΜέτρα — τι παίρνει ο παραλήπτης «Μεταφορά στοιχείων» (metafora-lipsi.js) από την παλιά διεύθυνση
   aglentzakis-dot.github.io/fotometra/ → fotometra.glenapps.gr.
   © 2026 Ανδρέας Μ. Γλεντζάκης (Andreas M. Glentzakis). Με την επιφύλαξη παντός δικαιώματος. All rights reserved.
   ls   : ρυθμίσεις, γλώσσα, τελευταία εργασία ανά πελάτη, ημερομηνίες αντιγράφων («fotometra-…»)
   idb  : «fotometra» (οι φωτογραφίες/μετρήσεις, αποθήκη "p") και «fotometra-safe» (εφεδρικό αντίγραφο μετρήσεων)
   opfs : καμία (η ΦωτοΜέτρα δεν γράφει στην ιδιωτική μνήμη αρχείων)
   Ο φάκελος αντιγράφων του κινητού («shared-backups») ΔΕΝ μεταφέρεται: ξαναδιαλέγεται στη νέα διεύθυνση.
   exei : αν εδώ έχει ήδη αποθηκευτεί εργασία (η εφαρμογή κρατά «fotometra-last:…» μετά από κάθε αποθήκευση). */
window.GLEN_METAFORA={app:"fotometra",onoma:"ΦωτοΜέτρα",
  ls:["fotometra-"],
  idb:["fotometra","fotometra-safe"],
  opfs:[],
  exei:function(){try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);
    if(k&&k.indexOf("fotometra-last:")===0&&localStorage.getItem(k))return true}return false}catch(e){return true}}};
