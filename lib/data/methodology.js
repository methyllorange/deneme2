// ASO-İLTEK metodoloji veri seti: rapor (s.166-168) çıktısı.

export const METHODOLOGY_CATEGORIES = [
    {
        id: 'sectoral',
        title: 'Sektörel Yapı',
        color: '#F68B1F',
        variables: [
            { name: 'Toplam girişim sayısı içinde yüksek teknolojili imalat ve hizmetlerin payı', source: 'TÜİK', year: '2023', unit: 'Binde' },
            { name: '4-1/a kapsamındaki zorunlu sigortalılardan yüksek teknolojili imalat ve yüksek teknolojili bilgi yoğun hizmet faaliyet alanlarında çalışanların payı', source: 'SGK, TÜİK', year: '2024', unit: 'Binde' },
        ],
    },
    {
        id: 'rnd',
        title: 'Araştırma ve Yenilikçilik Kapasitesi',
        color: '#114B95',
        variables: [
            { name: 'Yüz bin girişim başına Ar-Ge merkezi sayısı', source: 'Sanayi ve Teknoloji Bakanlığı, TÜİK', year: '2024', unit: 'Adet' },
            { name: 'Yüz bin girişim başına Teknoloji Geliştirme Bölgesi sayısı', source: 'Sanayi ve Teknoloji Bakanlığı, TÜİK', year: '2024', unit: 'Adet' },
            { name: 'Yüz bin girişim başına Tasarım Merkezi sayısı', source: 'Sanayi ve Teknoloji Bakanlığı, TÜİK', year: '2024', unit: 'Adet' },
            { name: 'Üniversitelerdeki yayın sayısı', source: 'ULAKBİM', year: '2024', unit: 'Adet' },
            { name: 'Son 5 yılda üniversitelerdeki proje sayısı', source: 'ULAKBİM', year: '2024', unit: 'Adet' },
            { name: 'Bin girişim başına teknoloji bölümlerindeki öğrenci sayısı', source: 'YÖK, TÜİK', year: '2024', unit: 'Adet' },
            { name: 'Bin girişim başına teknoloji bölümlerindeki akademisyen sayısı', source: 'YÖK, TÜİK', year: '2024', unit: 'Adet' },
            { name: 'Bin imalat girişimi başına sanayi Ar-Ge desteği alan firma sayısı', source: 'TÜBİTAK, TÜİK', year: '2024', unit: 'Adet' },
            { name: 'Bin girişim başına sanayi Ar-Ge desteği miktarı', source: 'TÜBİTAK, TÜİK', year: '2024', unit: 'TL' },
            { name: 'Bin imalat girişimi başına sanayi girişimcilik desteği alan firma sayısı', source: 'TÜBİTAK, TÜİK', year: '2024', unit: 'Adet' },
            { name: 'Bin girişim başına sanayi girişimcilik desteği miktarı', source: 'TÜBİTAK, TÜİK', year: '2024', unit: 'TL' },
        ],
    },
    {
        id: 'digital',
        title: 'Dijital Altyapı',
        color: '#1394B9',
        variables: [
            { name: 'Yüz kişi başına geniş bant abone sayısı', source: 'BTK, TÜİK', year: '2024', unit: 'Adet' },
            { name: 'Geniş bant abone sayısı içinde fiber abone sayısı payı', source: 'BTK, TÜİK', year: '2024', unit: 'Yüzde' },
            { name: 'Yüz kişi başına mobil geniş bant abone sayısı', source: 'BTK, TÜİK', year: '2024', unit: 'Adet' },
            { name: 'Yüz kişi başına 3G ve 4.5G bağlantılı mobil telefon sayısı', source: 'BTK, TÜİK', year: '2024', unit: 'Adet' },
        ],
    },
    {
        id: 'techOutput',
        title: 'Teknoloji Çıktıları',
        color: '#9B92C6',
        variables: [
            { name: 'Bin kişi başına patent tescil sayısı', source: 'TÜRKPATENT, TÜİK', year: '2024', unit: 'Adet' },
            { name: 'Bin kişi başına faydalı model tescil sayısı', source: 'TÜRKPATENT, TÜİK', year: '2024', unit: 'Adet' },
            { name: 'Bin kişi başına tasarım tescil sayısı', source: 'TÜRKPATENT, TÜİK', year: '2024', unit: 'Adet' },
            { name: 'İmalat sektöründeki girişim başına yüksek teknoloji ihracatı', source: 'TÜİK', year: '2024', unit: 'USD' },
        ],
    },
    {
        id: 'lifeQuality',
        title: 'Yaşam Kalitesi ve İş Gücü Çekiciliği',
        color: '#019963',
        variables: [
            { name: 'Öğrenci Dostu Üniversite Şehri Endeksi', source: 'ÜniAR', year: '2025', unit: 'Skor' },
            { name: 'Ortalama net göç hızı', source: 'TÜİK', year: '2022–2024', unit: 'Binde' },
            { name: 'Yüz kişi başına sinema koltuk sayısı', source: 'TÜİK', year: '2024', unit: 'Adet' },
            { name: 'Yüz kişi başına tiyatro koltuk sayısı', source: 'TÜİK', year: '2024', unit: 'Adet' },
            { name: 'Özel sektördeki ortalama ücret (SGP düzeltmesi yapılmış)', source: 'SGK, TÜİK', year: '2024', unit: 'TL' },
            { name: 'Kadın-erkek ortalama ücret oranı', source: 'SGK', year: '2024', unit: 'Yüzde' },
            { name: 'Kadınların ortalama ücreti (SGP düzeltmesi yapılmış)', source: 'SGK, TÜİK', year: '2024', unit: 'TL' },
            { name: 'İşsizlik oranı', source: 'TÜİK', year: '2024', unit: 'Yüzde' },
            { name: 'İstihdam oranı', source: 'TÜİK', year: '2024', unit: 'Yüzde' },
            { name: 'Bin kişi başına alışveriş ve ticaret alanı', source: 'Çevre, Şehircilik ve İklim Değişikliği Bakanlığı, TÜİK', year: '2025', unit: 'm²' },
            { name: 'Bin kişi başına eğlence, kültür ve spor yeri alanı', source: 'Çevre, Şehircilik ve İklim Değişikliği Bakanlığı, TÜİK', year: '2025', unit: 'm²' },
            { name: '18 yaş üstü yüz kişi başına düşen mekân sayısı', source: 'Tarım ve Orman Bakanlığı, TÜİK', year: '2025', unit: 'Adet' },
            { name: 'Yüz kişi başına uzman hekim sayısı', source: 'TÜİK', year: '2023', unit: 'Adet' },
            { name: 'İlköğretimde derslik başına düşen öğrenci sayısı', source: 'TÜİK', year: '2024', unit: 'Adet' },
            { name: 'İlkokulda öğretmen başına düşen öğrenci sayısı', source: 'TÜİK', year: '2024', unit: 'Adet' },
            { name: '3-5 yaş grubu için okul öncesi net okullaşma oranı', source: 'TÜİK', year: '2024', unit: 'Yüzde' },
        ],
    },
];

export const GRADES = [
    { letter: 'AA', label: 'Öncü', color: '#3b82f6', desc: 'Endeksin en üst kümesi; ulusal ortalamayı belirgin biçimde aşan iller.' },
    { letter: 'BA', label: 'Güçlü', color: '#60a5fa', desc: 'Pek çok alt endekste yüksek performans gösteren iller.' },
    { letter: 'BB', label: 'Dengeli', color: '#93c5fd', desc: 'Çoğu boyutta ortalamanın üzerinde, bazı alanlarda gelişim potansiyeli olan iller.' },
    { letter: 'CB', label: 'Orta', color: '#fcd34d', desc: 'Türkiye ortalamasına yakın profile sahip iller.' },
    { letter: 'CC', label: 'Gelişen', color: '#fbbf24', desc: 'Belirli boyutlarda zayıf, bazılarında orta-üst performans gösteren iller.' },
    { letter: 'DC', label: 'Yükselen', color: '#f59e0b', desc: 'Yapısal dönüşüm halinde, alt endekslerde belirli sıçramalar yaşayan iller.' },
    { letter: 'DD', label: 'Zayıf', color: '#d97706', desc: 'Endeks ortalamasının altında, birden çok boyutta destek ihtiyacı olan iller.' },
    { letter: 'FF', label: 'Kritik', color: '#ef4444', desc: 'Yapısal müdahale gerektiren, endeks tabanındaki iller.' },
];
