// These functions is the default API available for usage in filter code

exports.currentHour = {
    fn: function () {
        return (new Date()).getHours();
    },
    asc_import: "declare function currentHour(): number;"
}

exports.currentDay = {
    fn: function () {
        return (new Date()).getDay();
    },
    asc_import: "declare function currentDay(): number;",
}

exports.emailBody = {
    fn: () => {
        return "loReM iPsUm DoLOR SIt amET, cONsectetur adIPIscINg eliT. MAURiS cOnseQUAT EsT In EX rhOnCuS LObORTIs. VivaMuS fiNiBUs AccUMSAN aUcTOR. sUSpeNdisse vOlutpaT VeL teLlUs sEd ultRiCiEs. proin varIUS CursUS seMpeR. vEstiBULum TEMpor elEIFeND MaLesuAda. VivAMUS eT anTE FauCiBUs, tristIqUe Ante AC, rHOnCUs doloR. SuSPEndissE trisTiQUE dIctum RIsUs UT frINGilLA. quIsQUE ID TorToR siT AMeT elIt fINibUs SodaLeS. AlIqUaM eRAT FEliS, RUtruM iD ODIO iD, VOluTPat COnSECteTUR TorToR. fuscE eT lIGuLa SuScipIt, VEhiCUla puRuS sIT amet, commodO NEque. FuSCE prEtiuM EgestAs ORcI a fACILISIs. sEd lUCTUS eLiT vEl frIngiLLA vehiCuLa. intEgeR libErO AUGUE, SUSCiPit uT mAgnA SeD, EFFiCITuR TiNCiDUnT ElIT. donec rUtrum LECTUS NEc URNA ULTRiCEs mAXIMUs. sUSPenDIsse UlTricEs sapiEn EFFiCiTUr iMpERDiet TEmPOR. pRaeSenT tInciduNT LIBERO eRaT, sEd dIgnisSiM eniM FeugiaT ET. sED A dUi id MASsA pretIUm hENDrerIt a qUIS Mi. mAUriS ALIquEt, ToRtoR EU imperDIet ALiqUet, enIm arcU eLemEnTuM LEo, Non eUismoD NEQue nEQUE ac odIo. VEstiBuLUm qUiS ErAT PuLViNAr, fInibus OdIO Ac, PELLENtesQuE torTOR. PhasELLuS blAnDIt mAuriS vItaE lIGULa dIGNISSiM, sIT aMeT pOsUeRE NiBH FEugIAt. mAURIS vaRiUS Mi in eraT vuLpUTAtE, eT hendrerIt TORTOR scELeriSQUE. NAm EgEstAs, niSL qUis DApibUS AccumSan, saPieN ipSum LAciNiA SapIEn, Et FiNIbUs mAGna ipsUM eT tuRpIS. PRAeSEnt nOn CurSUS nIsI. NAm PUlviNAR LeCTUS ut eliT pHArEtRa trisTIQUe. eTiam MaTTIS TURPIS sit aMet justo matTIS oRnare. Ut AT JuStO IMpERDIEt, VeStiBuLum nunc ac, ELEIfEnd MasSA. pRAEsEnt A jUsto sit AMEt ENim MaTTiS cOmmODO sIt amet SIT amet NULLa. EtiaM aC dOLOR GrAvIDa, COmMOdO NeqUE nON, tIncIDUNT lEo. IN ACCUmsAn fErmEnTuM ELIT, aT PhAreTra DOLOR cOnDimENtum a. MORBI LACinIA ID tURPiS EU AlIqUam. Sed aT FElIs tinCIDUnT, laCIniA mETus uT, feuGIAT Orci. fuSCe VEL niBH in nIBh egeStAS LAoReeT. FuScE pelLENTESQUE QuIS elIT ET fRinGilLA. vEsTIbulUm gRAVIDa phAreTRa nuNC, neC euISmod fElis vestibULuM VItaE. iN hac hABiTasse Platea dictUmSt. cuRabITUr EgEt NUNc laCiniA, cOnsEqUAt sem AC, vestibulum sEM. FUScE faUcIbuS at NIBh nec trIsTiQuE. fUscE PhARETRa nisL eU FELis PREtiuM, iN PhARETRA veliT MAXIMus. intEGeR hendreRIt pUrus iD NISL FRInGilla AUcTOr vEL VITaE VEliT. Nulla vITAe venENATiS maGNa. doneC masSA risuS, vARIus ac NISI ET, UllAMcoRpEr UlTricIeS ANte. In mALEsuaDA sceLeRIsque sCeLeRIsQuE. fuSCe ARcu LiBeRO, TeMpuS SEd alIQUET In, VUlpUtatE eT orci. etIAm VENeNAtiS iPSUM A mI MAtTIS, Eu MaTTiS NuNc IMpERdiEt. etIAM pOrTTiTOR lECTUs Est, At uLlAMCORPer augue EfFiCItur ET. orci VARIUS NATOQue PENatIBuS et MaGnis DIs pARTUrIEnT MontES, nAsCeTUr ridiCULUS mUs. ALIQUAm pOrTTItOr MOllis TElLUs, In ulTrICES MEtuS IMpErdIet Ut. cURabitUR NEC ELEmentUM ToRToR.";
    },
    asc_import: "declare function emailBody(): string;",
}

exports.skipAction = {
    fn: function () {
        //! string in assemblyscript not yet working
        console.log("Action skipped!");
    },
    asc_import: "declare function skipAction(): void;",
}

// service providers API's
exports.sendSMS = {
    fn: function () {
        console.log('Sending a sms');
    },
    asc_import: "declare function sendSMS(): void;",
}

exports.sendEmail = {
    fn: function () {
        console.log('Sending an email');
    },
    asc_import: "declare function sendEmail(): void;",
}

exports.randomNumber = {
    fn: () => {
        return Math.random
    },
    asc_import: "declare function randomNumber(): number;",
}

exports.printNumber = {
    fn: (x) => {
        console.log(x);
    },
    asc_import: "declare function printNumber(x: number): void;",
}

exports.ipAdresses = {
    fn: () => {
        return require('./1000ipadresses').data;
    },
    asc_import: "declare function ipAdresses(): string;",
}

exports.consoleLog = {
    fn: (x) => {
        console.log(x);
    },
    asc_import: "declare function consoleLog(x: string): void;"
}

exports.getMembersOneWeekEvents = {
    fn: () => {
        return [(new Date().toISOString()), (new Date().toISOString())]
    },
    asc_import: "declare function getMembersOneWeekEvents(): Array<string>;",
}

exports.getMyOneWeekEvents = {
    fn: () => {
        return [(new Date().toISOString()), (new Date().toISOString())]
    },
    asc_import: "declare function getMyOneWeekEvents(): Array<string>;",
}

exports.upcomingClubEvents = {
    fn: () => {
        const dates =
            [
                (new Date(Date.now() + 1 * 60 * 60 * 1000)),
                (new Date(Date.now() + 4 * 60 * 60 * 1000)),
                (new Date(Date.now() + 7 * 60 * 60 * 1000)),
                (new Date(Date.now() + 8 * 60 * 60 * 1000)),
                (new Date(Date.now() + 24 * 60 * 60 * 1000)),
                (new Date(Date.now() + 26 * 60 * 60 * 1000)),
                (new Date(Date.now() + 45 * 60 * 60 * 1000)),
                (new Date(Date.now() + 47 * 60 * 60 * 1000)),
                (new Date(Date.now() + 52 * 60 * 60 * 1000)),
                (new Date(Date.now() + 53 * 60 * 60 * 1000)),
            ]
        return dates.map(dt => dt.toISOString());
    },
    asc_import: "declare function upcomingClubEvents(): Array<string>;",
}

exports.upcomingMyEvents = {
    fn: () => {
        const dates =
            [
                (new Date(Date.now() + 3 * 60 * 60 * 1000)),
                (new Date(Date.now() + 6 * 60 * 60 * 1000)),
                (new Date(Date.now() + 12 * 60 * 60 * 1000)),
                (new Date(Date.now() + 14 * 60 * 60 * 1000)),
                (new Date(Date.now() + 30 * 60 * 60 * 1000)),
                (new Date(Date.now() + 32 * 60 * 60 * 1000)),
                (new Date(Date.now() + 48 * 60 * 60 * 1000)),
                (new Date(Date.now() + 50 * 60 * 60 * 1000)),
                (new Date(Date.now() + 56 * 60 * 60 * 1000)),
                (new Date(Date.now() + 57 * 60 * 60 * 1000)),
            ]
        return dates.map(dt => dt.toISOString());
    },
    asc_import: "declare function upcomingMyEvents(): Array<string>;",
}

exports.sentimentScore = {
    fn: (text) => {
        const Sentiment = require('sentiment');
        var sentiment = new Sentiment();
        return sentiment.analyze(text).score;
    },
    asc_import: "declare function sentimentScore(msg: string): number;",
}