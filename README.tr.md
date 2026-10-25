# Turkish Entity Search — Türkçe

**Türkçe karakterleri, küçük yazım hatalarını ve partner arama ifadelerini anlayan açık kaynak TypeScript yardımcı kütüphanesi.**

[![CI](https://github.com/Nebride69/partnermap-search-core/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Nebride69/partnermap-search-core/actions/workflows/ci.yml)
[![Sürüm](https://img.shields.io/github/v/release/Nebride69/partnermap-search-core?label=s%C3%BCr%C3%BCm)](https://github.com/Nebride69/partnermap-search-core/releases)
[![MIT lisansı](https://img.shields.io/badge/lisans-MIT-2ea44f)](LICENSE)

**[English README](README.md)** · [Kod örnekleri](docs/EXAMPLES.md) · [Katkıda bulun](CONTRIBUTING.md) · [Güvenlik](SECURITY.md)

## Hangi problemi çözüyor?

Bir marka/iş ortağı arama ekranında şu sorguların kullanıcıyı sonuçsuz bırakmamasını hedefler:

| Kullanıcının yazdığı | Mevcut isim | Beklenen davranış |
| --- | --- | --- |
| `paloalto` | Palo Alto Networks | Boşluk farkını tolere eder |
| `fortnet` | Fortinet | Küçük bir yazım hatası için öneri verir |
| `İŞ ÇÖZÜMLERİ` | İş Çözümleri | Türkçe karakterleri normalize eder |
| `Cisco bayileri?` | Cisco | Bayi/partner arama niyetini ayırır |
| `EDR` | EDR Solutions | Kısa sorguda otomatik bulanık eşleşme yapmaz |

**Önemli sınır:** Kütüphane veritabanına bağlanmaz. Yalnızca uygulamanın kendisine verdiği **görünmesine izin verilen** aday isimlerini karşılaştırır. Kimlik doğrulama, erişim yetkisi, yayımlanma durumu ve hız sınırlaması uygulamaya aittir.

## Kurulum ve örnek kullanım

**Node.js 20 veya üzeri** gerekir. Henüz npm'de yayımlanmadı; GitHub üzerinden kaynak kod olarak kullanılabilir.

```bash
git clone https://github.com/Nebride69/partnermap-search-core.git
cd partnermap-search-core
npm install
npm test
npm run example
```

```js
import { parsePartnerIntent, rankNames } from './dist/index.js';

const arama = 'Palo Alto Türkiye partnerleri';
const { lookupQuery } = parsePartnerIntent(arama);

const gorunebilirMarkalar = [
  { name: 'Palo Alto Networks' },
  { name: 'Cisco' },
];

const sonuc = rankNames(
  lookupQuery,
  gorunebilirMarkalar,
  marka => marka.name
);
console.log(sonuc[0]?.item.name); // Palo Alto Networks
```

### Sunulan fonksiyonlar

| Fonksiyon | Görevi |
| --- | --- |
| `compactSearchName` | Türkçe büyük/küçük harf, Unicode ve noktalama normalizasyonu |
| `findNameRescueEvidence` | Tam, önek ve sınırlı yazım hatası eşleşmesi |
| `rankNames` | Uygulamanın gönderdiği izinli adayları puanlayıp sıralama |
| `parsePartnerIntent` | “partnerleri”, “bayileri”, “çözüm ortakları” gibi niyetleri algılama |
| `slugifyTr` | Türkçe isimlerden URL yolu oluşturma |

Eşleşme puanları başarı olasılığı değil, yalnızca **sıralama sinyalidir**. Ürün kimliği veya yetki kontrolü olarak kullanmayın.

## Gerçek kullanım: PartnerMap

[PartnerMap](https://www.partnermap.net) uygulamasında `v0.1.0` açık kaynak sürümünün lisanslı **kaynak kod kopyası** üretimde kullanılıyor. Bu, kütüphanenin npm üzerinden indirildiği veya üçüncü kişilerce benimsendiği anlamına gelmez.

23 Ekim 2026'da doğrulanmış canlı örnekler:

- [`paloalto` araması → Palo Alto Networks](https://www.partnermap.net/api/search?q=paloalto&type=vendor&page=1)
- [`fortniet` araması → Fortinet](https://www.partnermap.net/api/search?q=fortniet&type=vendor&page=1)

PartnerMap'in özel kaynak kodu, kullanıcı verileri, gizli anahtarları ve veritabanı yapısı bu açık kaynak depoda bulunmaz.

## Katkı ve yol haritası

Türkçe metin arama senaryoları için test, hata bildirimi ve dokümantasyon katkıları memnuniyetle karşılanır. Gerçek müşteri verileri yerine örnek/sentetik veri kullanın.

- [Katkı rehberi](CONTRIBUTING.md)
- [Hata veya öneri bildir](https://github.com/Nebride69/partnermap-search-core/issues/new/choose)
- [Geliştirme yol haritası](docs/ROADMAP.md)
- [Testler ve GitHub Actions](https://github.com/Nebride69/partnermap-search-core/actions/workflows/ci.yml)
- [İlk sürüm — v0.1.0](https://github.com/Nebride69/partnermap-search-core/releases/tag/v0.1.0)

**Lisans:** [MIT](LICENSE). Bu depo yeni bir açık kaynak projesidir; doğrulanmamış kullanıcı, indirme veya benimsenme sayıları iddia edilmez.
