import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeLegacyHtml,
  isMaliciousUrl,
  hasSpamContent,
  ES_UINSGD_AUDIT_REPORT,
} from "./import-sanitizer";

test("isMaliciousUrl detects doorway, pharma, and judol spam URLs from es.uinsgd.ac.id", () => {
  assert.equal(isMaliciousUrl("https://es.uinsgd.ac.id/?e=256402116"), true);
  assert.equal(isMaliciousUrl("https://es.uinsgd.ac.id/legal-anadrol-for-sale-gregory-dupont-le/"), true);
  assert.equal(isMaliciousUrl("https://febi.uinsgd.ac.id/official/gacor/"), true);
  assert.equal(isMaliciousUrl("https://bki.uinsgd.ac.id/situstoto/"), true);
  assert.equal(isMaliciousUrl("https://es.uinsgd.ac.id/vendor/"), true);
  assert.equal(
    isMaliciousUrl("https://es.uinsgd.ac.id/tanam-pohon-upaya-mewujudkan-green-halal-village/"),
    false,
  );
  assert.equal(
    isMaliciousUrl("https://digilib.uinsgd.ac.id/view/divisions/prodi=5Fekonomi=5Fsyariah/"),
    false,
  );
});

test("sanitizeLegacyHtml strips hidden spam blocks and scripts while preserving legitimate Ekonomi Syariah content", () => {
  const infectedHtml = `
    <div style="display:none">
      <a href="https://m2reg.ulm.ac.id/gacor/">Slot Gacor</a>
      <a href="https://es.uinsgd.ac.id/vendor/">Vendor Toto</a>
    </div>
    <script>window.location="https://malicious.example.com";</script>
    <article>
      <h1>Tanam Pohon Upaya Mewujudkan Green Halal Village</h1>
      <p>Kaprodi Ekonomi Syariah melakukan penanaman 150 pohon bersama komunitas Sabilulungan Bersih (SABER) di Desa Indragiri Kabupaten Bandung.</p>
      <a href="https://digilib.uinsgd.ac.id">Repositori Skripsi UIN SGD</a>
      <a href="https://es.uinsgd.ac.id/?e=554047316">Link Doorway</a>
    </article>
  `;

  const result = sanitizeLegacyHtml(infectedHtml);
  assert.equal(result.isSafe, true);
  assert.equal(result.threatsRemoved >= 3, true);
  assert.equal(result.blockedLinks.includes("https://m2reg.ulm.ac.id/gacor/"), true);
  assert.equal(result.blockedLinks.includes("https://es.uinsgd.ac.id/?e=554047316"), true);
  assert.equal(result.cleanLinks.length, 1);
  assert.equal(result.cleanLinks[0].url, "https://digilib.uinsgd.ac.id");
  assert.match(result.cleanText, /Tanam Pohon Upaya Mewujudkan Green Halal Village/);
  assert.match(result.cleanText, /Sabilulungan Bersih/);
  assert.doesNotMatch(result.cleanText, /Gacor|Toto|malicious/i);
});

test("audit report contains verified archive counts", () => {
  assert.equal(ES_UINSGD_AUDIT_REPORT.stats.skripsiImported, 515);
  assert.equal(ES_UINSGD_AUDIT_REPORT.stats.dosenImported >= 20, true);
  assert.equal(hasSpamContent("Program Studi Ekonomi Syariah FEBI UIN SGD"), false);
  assert.equal(hasSpamContent("Daftar Situs Slot Gacor Macau Hari Ini"), true);
});
