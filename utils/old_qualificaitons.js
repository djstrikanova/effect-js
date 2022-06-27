const old_qualis = [
    { 'name': 'Basic English Proficiency', 'description': 'Basic English Proficiency. User demonstrates command and use of English language in a conversational manner. ' },
    { 'name': 'English (US) Proofreading', 'description': 'English US Proofreader. User has a high to expert level of English language skills and a mastery of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'Chinese (Simplified) Translation/Proofreading', 'description': 'Chinese Language Translator/Proofreader. User has a high to expert level of Simplified Chinese language skills and a mastery of correct characters, radicals, proper structure, and an eye for detail. ' },
    { 'name': 'Indonesian Translation/Proofreading', 'description': 'Bahasa Indonesia Translator/Proofreader. User has a high to expert level of Bahasa Indonesia language skills and a mastery of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'Arabic Translation/Proofreading', 'description': 'Arabic Translator/Proofreader. User has a high to expert level of Modern Standard Arabic skills and a master of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'Spanish Translation/Proofreading', 'description': 'Spanish (EU) Translator/Proofreader. User has a high to expert level of European Spanish language skills and a mastery of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'Portuguese (Brazilian) Translation/Proofreading', 'description': 'Portguese (Brazilian) Translator/Proofreader. User has a high to expert level of Brazilian Portuguese language skills and a mastery of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'Italian Translation/Proofreading', 'description': 'Italian Translator/Proofreader. User has a high to expert level of Italian language skills and a mastery of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'German Translation/Proofreading', 'description': 'German Translator/Proofreader. User has a high to expert level of German language skills and a mastery of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'French Translation/Proofreading', 'description': 'French Translator/Proofreader. User has a high to expert level of French language skills and a mastery of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'Polish Translation/Proofreading', 'description': 'Polish Translator/Proofreader. User has a high to expert level of Polish language skills and a mastery of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'Dutch Translation/Proofreading', 'description': 'Dutch Translator/Proofreader. User has a high to expert level of Dutch language skills and a mastery of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'Georgian Translation/Proofreading', 'description': 'Georgian Translator/Proofreader. User has a high to expert level of Georgian language skills and a mastery of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'Russian Translation/Proofreading', 'description': 'Russian Translator/Proofreader. User has a high to expert level of Russian language skills and a mastery of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'Turkish Translation/Proofreading', 'description': 'Turkish Translator/Proofreader. User has a high to expert level of Turkish language skills and a mastery of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'Twitter Account (Self Select)', 'description': 'Twitter platform user. User has an active Twitter account. ' },
    { 'name': 'Discord Account (Self Select)', 'description': 'Discord platform user. User has an active Discord account. ' },
    { 'name': 'Facebook Account (Self Select)', 'description': 'Facebook platform user. User has an active Facebook account. ' },
    { 'name': 'YouTube Account (Self Select)', 'description': 'YouTube platform user. User has an active YouTube account. ' },
    { 'name': 'Instagram Account (Self Select)', 'description': 'Instagram platform user. User has an active Instagram account. ' },
    { 'name': 'Telegram Account (Self Select)', 'description': 'Telegram platform user. User has an active Telegram account. ' },
    { 'name': 'Reddit Account (Self Select)', 'description': 'Reddit platform user. User has an active Reddit account. ' },
    { 'name': 'GitHub Account (Self Select)', 'description': 'GitHub platform user. User has an active GitHub account. ' },
    { 'name': 'ES Translation Validator', 'description': 'ES Translation Validator. User is proficient in checking others` work and validating for correctness.' },
    { 'name': 'ZH Translation Validator', 'description': 'ZH Translation Validator. User is proficient in checking others` work and validating for correctness.' },
    { 'name': 'PT Translation Validator', 'description': 'PT Translation Validator. User is proficient in checking others` work and validating for correctness.' },
    { 'name': 'RU Translation Validator', 'description': 'RU Translation Validator. User is proficient in checking others` work and validating for correctness.' },
    { 'name': 'ES Translation Master Validator', 'description': 'ES Translation Master Validator. User is expertly proficient in checking others` work and making corrections.' },
    { 'name': 'ZH Translaiton Master Validator', 'description': 'ZH Translaiton Master Validator. User is expertly proficient in checking others` work and making corrections.' },
    { 'name': 'RU Translation Master Validator', 'description': 'RU Translation Master Validator. User is expertly proficient in checking others` work and making corrections.' },
    { 'name': 'PT Translation Master Validator', 'description': 'PT Translation Master Validator. User is expertly proficient in checking others` work and making corrections.' },
    { 'name': 'NL Translation Validator', 'description': 'NL Translation Validator. User is proficient in checking others` work and validating for correctness.' },
    { 'name': 'ID Translation Validator', 'description': 'ID Translation Validator. User is proficient in checking others` work and validating for correctness.' },
    { 'name': 'PL Translation Validator', 'description': 'PL Translation Validator. User is proficient in checking others` work and validating for correctness.' },
    { 'name': 'FR Translation Validator', 'description': 'FR Translation Validator. User is proficient in checking others` work and validating for correctness.' },
    { 'name': 'IT Translation Validator', 'description': 'IT Translation Validator. User is proficient in checking others` work and validating for correctness.' },
    { 'name': 'AR Translation Validator', 'description': 'AR Translation Validator. User is proficient in checking others` work and validating for correctness.' },
    { 'name': 'Translation Master Validator', 'description': 'Translation Master Validator. User is expertly proficient in checking others` work and making corrections.' },
    { 'name': 'Subtitle Master Validator', 'description': 'Subtitle Master Validator. User is expertly proficient in checking others` work and making corrections.' },
    { 'name': 'DE Translation Validator', 'description': 'DE Translation Validator. User is proficient in checking others` work and validating for correctness.' },
    { 'name': 'Closed Caption Test (Open Book)', 'description': 'Closed Caption Test (Open Book). User has familiarity in the captioning process and basic rules.' },
    { 'name': 'Effect FORCE Captioner', 'description': 'Effect FORCE Captioner. User has demonstrated they are proficient in closed caption creation, proofreading, and editing in accordance to closed captioning best practices.' },
    { 'name': 'KHMS Translator', 'description': 'KHMS Translator. User has completed requirements in order to complete tasks for KH. ' },
    { 'name': 'EN Native Captioner', 'description': 'EN Native Captioner. User has demonstrated a master of proficiency in creating captions in the English language from English (US) audio. ' },
    { 'name': 'Kastaar', 'description': 'Kastaar' },
    { 'name': 'Troubadour', 'description': 'Troubadour' },
    { 'name': 'Flemish Transcriber', 'description': 'Flemish Transcriber. User is proficient in transcribing and creating captions in Flemish. ' },
    { 'name': 'Dutch Caption Creator', 'description': 'Dutch Caption Creator. User has demonstrated a master of proficiency in creating captions in the Dutch language from Dutch audio. ' },
    { 'name': 'Special Sauce', 'description': 'Special Sauce. User demonstrated exceptional ability in completing tasks for KH' },
    { 'name': 'KHMS Translator', 'description': 'DUPLICATE LISTING, see above for TestnetQualifier #125' },
    { 'name': 'Pirate Translator/Proofreader', 'description': 'Pirate Translator/Proofreader' },
    { 'name': 'Storm Trooper 2021', 'description': 'Storm Trooper 2021' },
    { 'name': 'ar-EG Translator', 'description': 'Arabic Translator/Proofreader (Egyptian dialect). User has a high to expert level of Modern Standard Arabic skills in the Egyptian dialect, and a master of correct sentence structure, word choice, punctuation, and an eye for detail. ' },
    { 'name': 'ar-EG Validator', 'description': 'ar-EG Validator. User is proficient in checking others` work and validating for correctness.' },
]

const other_qualis = [
    { 'name': 'Basic Papiamento Proficiency', 'description': 'Basic Papiamento Proficiency. User demonstrates command and use of Papiamento language in a conversational manner. ' },
]
    
exports.old_qualis = {old_qualis, other_qualis};


/**
 *     { 'name': 'NL Translator Proofreader Blacklist ', 'description': 'NL Translator Proofreader Blacklist. User is removed from tasks requiring this qualification.  ' },
    { 'name': 'DE Translator Proofreader Blacklist', 'description': 'DE Translator Proofreader Blacklist. User is removed from tasks requiring this qualification. ' },
    { 'name': 'ES Translator Proofreader Blacklist', 'description': 'ES Translator Proofreader Blacklist. User is removed from tasks requiring this qualification. ' },
    { 'name': 'RU Translator Proofreader Blacklist', 'description': 'RU Translator Proofreader Blacklist. User is removed from tasks requiring this qualification. ' },
    { 'name': 'PT Translator Proofreader Blacklist', 'description': 'PT Translator Proofreader Blacklist. User is removed from tasks requiring this qualification. ' },
    { 'name': 'AR Translator Proofreader Blacklist', 'description': 'AR Translator Proofreader Blacklist. User is removed from tasks requiring this qualification. ' },
    { 'name': 'ID Translator Proofreader Blacklist', 'description': 'ID Translator Proofreader Blacklist. User is removed from tasks requiring this qualification. ' },
    { 'name': 'FR Translator Proofreader Blacklist', 'description': 'FR Translator Proofreader Blacklist. User is removed from tasks requiring this qualification. ' },
    { 'name': 'IT Translator Proofreader Blacklist', 'description': 'IT Translator Proofreader Blacklist. User is removed from tasks requiring this qualification. ' },
    { 'name': 'ZH Translator Proofreader Blacklist', 'description': 'ZH Translator Proofreader Blacklist. User is removed from tasks requiring this qualification. ' },
    { 'name': 'PL Translator Proofreader Blacklist', 'description': 'PL Translator Proofreader Blacklist. User is removed from tasks requiring this qualification. ' },
    { 'name': 'Validator Blacklist', 'description': 'Validator Blacklist. User is removed from tasks requiring this qualification. ' },
    { 'name': 'Block KH Tasks', 'description': 'Block KH Tasks. User is removed from tasks requiring this qualification. ' },
   bbb
 */