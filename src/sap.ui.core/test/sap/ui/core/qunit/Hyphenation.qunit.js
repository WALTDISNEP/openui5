/*global QUnit */

sap.ui.define("sap/ui/core/qunit/Hyphenation.qunit", [
    "sap/ui/core/hyphenation/Hyphenation",
    "sap/ui/Device",
    "sap/base/Log"
], function(Hyphenation, Device, Log) {
    "use strict";

var sSingleLangTest = "de",
    aSupportedLanguages = [
        "bg",
        "ca",
        "hr",
        "da",
        "nl",
        "en-us",
        "et",
        "fi",
        "fr",
        "de",
        "el",
        "hi",
        "hu",
        "it",
        "lt",
        "nb-no",
        "pt",
        "ru",
        "sl",
        "es",
        "sv",
        "th",
        "tr",
        "uk"
    ],
    aNotaSupportedLanguages = [
        "cs", "vi"
    ],
    sBrowserAndDevice = Device.browser.name + "-" + Device.os.name,
    mBrowserNativeSupport = {
        "ie-win": {
            "en-us": true,
            "de": false,
            "ru": false
        },
        "ed-win": {
            "en-us": true,
            "de": false,
            "ru": false
        },
        "cr-win": {
            "en-us": false,
            "de": false,
            "ru": false
        },
        "ff-win": {
            "en-us": true,
            "de": true,
            "ru": true
        }
    },
    mWords = {
        // lang: [not hyphenated, hyphenated]
        "bg": ["непротивоконституционствувателствувайте", "неп-ро-ти-во-кон-с-ти-ту-ци-он-с-т-ву-ва-тел-с-т-ву-вай-те"],
        "ca": ["Psiconeuroimmunoendocrinologia", "Psi-co-neu-roim-mu-no-en-do-cri-no-lo-gia"],
        "hr": ["prijestolonasljednikovičičinima", "pri-jes-to-lo-na-s-ljed-ni-ko-vi-či-či-ni-ma"],
        "da": ["Gedebukkebensoverogundergeneralkrigskommander", "Ge-de-buk-ke-ben-soverogun-der-ge-ne-ral-krigskom-man-der"], // original word was Gedebukkebensoverogundergeneralkrigskommandersergenten
        "nl": ["meervoudigepersoonlijkheidsstoornissen", "meer-vou-di-ge-per-soon-lijk-heids-stoor-nis-sen"],
        "en-us": ["pneumonoultramicroscopicsilicovolcanoconiosis", "pneu-mo-noul-tra-mi-cro-scop-ic-sil-i-co-vol-canoco-nio-sis"],
        "et": ["Sünnipäevanädalalõpupeopärastlõunaväsimus", "Sün-ni-päe-va-nä-da-la-lõ-pu-peo-pä-rast-lõu-na-vä-si-mus"],
        "fi": ["kolmivaihekilowattituntimittari", "kolmivaihekilowattituntimittari"],
        "fr": ["hippopotomonstrosesquippedaliophobie", "hip-po-po-to-mons-tro-ses-quip-pe-da-lio-pho-bie"],
        "de": ["Kindercarnavalsoptochtvoorbereidingswerkzaamheden", "Kin-der-car-na-vals-op-tocht-vo-or-berei-dings-werk-zaam-he-den"], // original word was Kindercarnavalsoptochtvoorbereidingswerkzaamhedenplan
        "el": ["ηλεκτροεγκεφαλογράφημα", "ηλε-κτρο-ε-γκε-φα-λο-γρά-φη-μα"],
        "hi": ["किंकर्तव्यविमूढ़", "किं-क-र्-त-व्-य-वि-मूढ़"],
        "hu": ["Megszentségteleníthetetlenségeskedéseitekért", "Meg-szent-ség-te-le-nít-he-tet-len-sé-ges-ke-dé-se-i-te-kért"],
        "it": ["hippopotomonstrosesquippedaliofobia", "hip-po-po-to-mon-stro-se-squip-pe-da-lio-fo-bia"],
        "lt": ["nebeprisikiškiakopūstlapiaujančiuosiuose", "ne-be-pri-si-kiš-kia-ko-pūst-la-piau-jan-čiuo-siuo-se"],
        "pt": ["pneumoultramicroscopicossilicovulcanoconiose", "pneu-moul-tra-mi-cros-co-pi-cos-si-li-co-vul-ca-no-co-ni-ose"],
        "ru": ["превысокомногорассмотрительствующий", "пре-вы-со-ком-но-го-рас-смот-ри-тель-ству-ю-щий"],
        "sl": ["Dialektičnomaterialističen", "Di-a-lek-tič-no-ma-te-ri-a-li-sti-čen"],
        "es": ["Electroencefalografistas", "Elec-tro-en-ce-fa-lo-gra-fis-tas"],
        "sv": ["Realisationsvinstbeskattning", "Re-a-li-sa-tions-vinst-be-skatt-ning"],
        "th": ["ตัวอย่างข้อความที่จะใช้ในการยืนยันการถ่ายโอน", "ตัวอย่างข้อค-วามที่จะใช้ใน-การยืน-ยัน-การถ่ายโอน"],
        "tr": ["Muvaffakiyetsizleştiricileştiriveremeyebileceklerimizdenmişsinizcesine", "Muvaffakiyetsizleştiricileştiriveremeyebileceklerimizdenmişsinizcesine"],
        "uk": ["Нікотинамідаденіндинуклеотидфосфат", "Ні-ко-ти-на-мі-да-де-нін-ди-ну-кле-о-тид-фо-сфат"]
    },
    mTexts = {
        // lang: [not hyphenated, hyphenated]
        "en-us": [
            "A hyphenation algorithm is a set of rules that decides at which points a word can be broken over two lines with a hyphen.",
            "A hy-phen-ation al-go-rithm is a set of rules that de-cides at which points a word can be bro-ken over two lines with a hy-phen."
        ],
        "de": [
            "Die Worttrennung, auch Silbentrennung genannt, bezeichnet in der Orthographie die Art und Weise, wie die Wörter insbesondere am Zeilenende getrennt werden können.",
            "Die Wort-tren-nung, auch Sil-ben-tren-nung ge-nannt, be-zeich-net in der Or-tho-gra-phie die Art und Weise, wie die Wör-ter ins-be-son-de-re am Zei-len-en-de ge-trennt wer-den kön-nen."
        ],
        "ru": [
            "Пример текста, который будет служить для проверки перевода.",
            "При-мер тек-ста, ко-то-рый будет слу-жить для про-вер-ки пе-ре-во-да."
        ]
    },
    mExceptionsEn = {
        "hyphen": "h-y-p-h-e-n",
        "example": "example"
    };

    function getDefaultLang() {
        var oLocale = sap.ui.getCore().getConfiguration().getLocale(),
            sLanguage = oLocale.getLanguage().toLowerCase();

        if (sLanguage === "en") {
            sLanguage += "-us";
        }

        return sLanguage;
    }

    QUnit.module("Instance");

    QUnit.test("create instance", function(assert) {
        var oHyphenation = Hyphenation.getInstance();

        assert.ok(oHyphenation, "instance is created");
        assert.strictEqual(oHyphenation.isA("sap.ui.core.hyphenation.Hyphenation"), true, "instance is correct");
    });

    QUnit.module("Initialization", {
        before: function () {
            this.oHyphenation = Hyphenation.getInstance();
        }
    });

    QUnit.test("default initialize", function(assert) {
        assert.expect(3);

        var done = assert.async();

        this.oHyphenation.initialize().then(function() {
            assert.strictEqual(this.oHyphenation.bIsInitialized, true, "hyphenation api is initialized with default params");

            var sDefaultLang = getDefaultLang();
            assert.strictEqual(this.oHyphenation.isLanguageInitialized(sDefaultLang), true, "default lang '" + sDefaultLang + "' was initialized");
            assert.notOk(this.oHyphenation.getExceptions(), "there are no exceptions defined");

            done();
        }.bind(this));
    });

    QUnit.test("initialize only single language - " + sSingleLangTest, function(assert) {
        assert.expect(3);

        var done = assert.async();

        this.oHyphenation.initialize(sSingleLangTest).then(function() {
            assert.strictEqual(this.oHyphenation.isLanguageInitialized(sSingleLangTest), true, "hyphenation api is initialized with language - " + sSingleLangTest);

            assert.ok(this.oHyphenation.getInitializedLanguages().indexOf(sSingleLangTest) > -1, "list of initialized languages contains " + sSingleLangTest);

            assert.ok(this.oHyphenation.getInitializedLanguages().length <= 2, "not more than 2 languages are initialized");

            done();
        }.bind(this)).catch(function(e) {
            assert.ok(false, e);
        });
    });

    QUnit.test("initialize all supported languages", function(assert) {
        assert.expect(aSupportedLanguages.length + 1);

        var done = assert.async(),
            that = this,
            counter = 0;

        aSupportedLanguages.forEach(function(sLang) {

            that.oHyphenation.initialize(sLang).then(function() {
                counter++;
                assert.strictEqual(that.oHyphenation.isLanguageInitialized(sLang), true, sLang + " is initialized");

                if (counter >= aSupportedLanguages.length) {
                    assert.strictEqual(that.oHyphenation.getInitializedLanguages().length, aSupportedLanguages.length, "all languages are initialized");
                    done();
                }
            }).catch(function(e) {
                assert.ok(false, e);
            });
        });
    });

    QUnit.test("fail to initialize not supported languages", function(assert) {
        assert.expect(aNotaSupportedLanguages.length * 2);

        var done = assert.async(),
            that = this,
            counter = 0;

        aNotaSupportedLanguages.forEach(function(sLang) {
            assert.strictEqual(that.oHyphenation.isLanguageInitialized(sLang), false, sLang + " is by default not initialized");

            that.oHyphenation.initialize(sLang).then(function() {
                assert.ok(false, "not supported language '" + sLang + "' was initialized");
            }).catch(function(e) {
                counter++;
                assert.ok(true, sLang + " is not supported");

                if (counter === aNotaSupportedLanguages.length) {
                    done();
                }
            });
        });
    });

    QUnit.module("Hyphenation", {
        before : function () {
            this.oHyphenation = Hyphenation.getInstance();
        }
    });

    QUnit.test("can use native hyphenation for " + sBrowserAndDevice, function(assert) {
        var mCanUseLanguages = mBrowserNativeSupport[sBrowserAndDevice];

        if (mCanUseLanguages) {
            assert.expect(Object.keys(mCanUseLanguages).length);

            for (var sLang in mCanUseLanguages) {
                assert.strictEqual(this.oHyphenation.canUseNativeHyphenation(sLang), mCanUseLanguages[sLang], "can use for lang '" + sLang + "' should be '" + mCanUseLanguages[sLang]);
            }
        } else {
            assert.ok(true, "no tests available for browser '" + sBrowserAndDevice + "'");
        }
    });

    QUnit.test("change hyphen symbol", function(assert) {
        assert.expect(1);

        var done = assert.async(),
            that = this;

        this.oHyphenation.initialize("en-us", {"hyphen": "-"}).then(function() {
            assert.strictEqual(
                that.oHyphenation.hyphenate("hyphen"),
                "hy-phen",
                "hyphenation symbol is changed to '-'"
            );
            done();
        });
    });

    QUnit.test("hyphenate example words", function(assert) {
        var done = assert.async(),
            that = this,
            counter = 0,
            aLanguages = Object.keys(mWords);

        assert.expect(aLanguages.length);

        aLanguages.forEach(function(sLang) {
            that.oHyphenation.initialize(sLang, {"hyphen": "-"}).then(function() {
                counter++;

                assert.strictEqual(
                    that.oHyphenation.hyphenate(mWords[sLang][0], sLang),
                    mWords[sLang][1],
                    "hyphenation of example word for '" + sLang + "' is ok"
                );

                if (counter === aLanguages.length) {
                    done();
                }
            });
        });
    });

    QUnit.test("hyphenate example texts", function(assert) {
        var done = assert.async(),
            that = this,
            counter = 0,
            aLanguages = Object.keys(mTexts);

        assert.expect(aLanguages.length);

        aLanguages.forEach(function(sLang) {
            that.oHyphenation.initialize(sLang, {"hyphen": "-"}).then(function() {
                counter++;

                assert.strictEqual(
                    that.oHyphenation.hyphenate(mTexts[sLang][0], sLang),
                    mTexts[sLang][1],
                    "hyphenation of example text for '" + sLang + "' is ok"
                );

                if (counter === aLanguages.length) {
                    done();
                }
            });
        });
    });

    QUnit.test("fail to hyphenate with not initialized language", function(assert) {
        var oErrorLogSpy = this.spy(Log, "error"),
            onError = function() {
                assert.ok(true, "error event was thrown");
            };

        this.oHyphenation.attachEvent("error", onError);

        assert.strictEqual(this.oHyphenation.hyphenate("Lorem ipsum", "test-lang"), "Lorem ipsum", "hyphenate of uninitialized lang returns the same text without changes");

        assert.ok(oErrorLogSpy.calledOnce, "an error was logged");

        Log.error.restore();
        this.oHyphenation.detachEvent("error", onError);
    });

    QUnit.module("Word exceptions", {
        before : function () {
            this.oHyphenation = Hyphenation.getInstance();
        }
    });

    QUnit.test("reinitialize a language to add exceptions", function(assert) {
        assert.expect(3);

        var done = assert.async(),
            that = this;

        this.oHyphenation.initialize("en-us", {hyphen: "-", exceptions: mExceptionsEn}).then(function() {
            assert.deepEqual(that.oHyphenation.getExceptions("en-us"), mExceptionsEn, "get exceptions returns correct exceptions");

            assert.strictEqual(that.oHyphenation.hyphenate("hyphen"), "h-y-p-h-e-n", "exception for word 'hyphen' works");
            assert.strictEqual(that.oHyphenation.hyphenate("example"), "example", "exception for word 'example' works");

            done();
        });
    });

    QUnit.test("reinitialize a language to remove exceptions", function(assert) {
        assert.expect(3);

        var done = assert.async(),
            that = this;

        this.oHyphenation.initialize("en-us").then(function() {
            assert.notDeepEqual(that.oHyphenation.getExceptions(), mExceptionsEn, "get exceptions returns correct exceptions");

            assert.notEqual(that.oHyphenation.hyphenate("hyphen"), "h-y-p-h-e-n", "there are no exceptions for word 'hyphen'");
            assert.notEqual(that.oHyphenation.hyphenate("example"), "example", "there are no exceptions for word 'example'");

            done();
        });
    });

    QUnit.test("add exceptions and get exceptions", function(assert) {
        assert.expect(3);

        var done = assert.async(),
            that = this;

        this.oHyphenation.initialize("en-us").then(function() {
            that.oHyphenation.addExceptions("en-us", mExceptionsEn);

            assert.deepEqual(that.oHyphenation.getExceptions("en-us"), mExceptionsEn, "get exceptions returns correct exceptions");

            assert.strictEqual(that.oHyphenation.hyphenate("hyphen"), "h-y-p-h-e-n", "exception for word 'hyphen' works");
            assert.strictEqual(that.oHyphenation.hyphenate("example"), "example", "exception for word 'example' works");

            done();
        });
    });
});
