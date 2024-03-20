import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signature-form',
  templateUrl: './signature-form.component.html',
  styleUrls: ['./signature-form.component.scss']
})
export class SignatureFormComponent {
  signatureForm = new FormGroup({
    company: new FormControl(''),
    title: new FormControl(''),
    name: new FormControl(''),
    secondTitle: new FormControl(''),
    position: new FormControl(''),
    phone: new FormControl(''),
    phone2: new FormControl(''),
    email: new FormControl(''),
    website: new FormControl(''),
    // division: new FormControl(''),
    division1: new FormControl(false),
    division2: new FormControl(false),
    division3: new FormControl(false),
    division4: new FormControl(false),
    division5: new FormControl(false),
    division6: new FormControl(false),
    division7: new FormControl(false),
    division8: new FormControl(false),
    division9: new FormControl(false),
    division10: new FormControl(false),

    fileBanner: new FormControl(''),
  });

  constructor(private http: HttpClient) {}

  exportSignature() {
    const company = this.signatureForm.value.company;
    if (!company) {
      alert('Prosím, vyberte společnost.');
      return;
    }

    const templatePath = `assets/signatures/${company}.html`;
    this.http.get(templatePath, { responseType: 'text' })
      .subscribe(templateContent => {
        // Zde můžete nahradit proměnné ve šabloně a připravit ji k exportu
        const preparedContent = this.prepareContent(templateContent);
        this.exportAsHtmlFile(preparedContent, `${company}-signature.htm`);
      });
  }

  base64ImageBanner: string | null = null;
  imageWidthBanner: number | null = null;
  imageHeightBanner: number | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageSrc = reader.result as string;
        this.base64ImageBanner = imageSrc;

        // Vytvoření Image objektu pro získání rozměrů
        const img = new Image();
        img.onload = () => {
          this.imageWidthBanner = img.naturalWidth;
          this.imageHeightBanner = img.naturalHeight;

          // Zde můžete volat metodu pro přípravu obsahu šablony nebo aktualizovat view
          // Například: this.prepareContent();
        };
        img.src = imageSrc; // Nastavení zdroje obrázku
      };

      reader.readAsDataURL(file);
    }
  }

  prepareContent(templateContent: string): string {
    let content = templateContent;

    // Zpracování druhého titulu (pouze pokud je vyplněn)
    const secondTitle = this.signatureForm.value.secondTitle;
    if (secondTitle) {
      content = content.replace(/{{secondTitle}}/g, secondTitle);
    } else {
      // Odstranění placeholderu pro druhý titul, pokud není vyplněn
      content = content.replace(/{{secondTitle}}/g, '');
    }

    // Příprava formátované a neformátované verze telefonních čísel
    const phone = this.signatureForm.value.phone;
    const phone2 = this.signatureForm.value.phone2;

    const formattedPhone = this.formatPhoneNumber(phone);
    const formattedPhone2 = this.formatPhoneNumber(phone2);

    // Nahrazení placeholderů v šabloně
    content = content.replace(/{{phone}}/g, formattedPhone);
    content = content.replace(/{{phone2}}/g, formattedPhone2);

    // Pro href atributy použijte neformátované verze
    content = content.replace(/{{href_phone}}/g, phone);
    content = content.replace(/{{href_phone2}}/g, phone2);

    // Odstranění bloku pro phone2, pokud není vyplněno
    if (!phone2) {
      content = content.replace(/<!--PHONE2_START-->[\s\S]*?<!--PHONE2_END-->/g, '');
    }

    // Nahradit zbývající placeholder hodnotami z formuláře
    Object.keys(this.signatureForm.value).forEach(key => {
      // Přeskočit phone a phone2, protože ty už byly zpracovány
      if (key !== 'phone' && key !== 'phone2') {
        let value = this.signatureForm.value[key] || '';
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, value);
      }
    });

    const division1 = this.signatureForm.value.division1;
    if (!division1) {
      content = content.replace(/<!--DIVISION1_START-->[\s\S]*?<!--DIVISION1_END-->/g, '');
    }

    const division2 = this.signatureForm.value.division2;
    if (!division2) {
      content = content.replace(/<!--DIVISION2_START-->[\s\S]*?<!--DIVISION2_END-->/g, '');
    }

    const division3 = this.signatureForm.value.division3;
    if (!division3) {
      content = content.replace(/<!--DIVISION3_START-->[\s\S]*?<!--DIVISION3_END-->/g, '');
    }

    const division4 = this.signatureForm.value.division4;
    if (!division4) {
      content = content.replace(/<!--DIVISION4_START-->[\s\S]*?<!--DIVISION4_END-->/g, '');
    }

    const division5 = this.signatureForm.value.division5;
    if (!division5) {
      content = content.replace(/<!--DIVISION5_START-->[\s\S]*?<!--DIVISION5_END-->/g, '');
    }

    const division6 = this.signatureForm.value.division6;
    if (!division6) {
      content = content.replace(/<!--DIVISION6_START-->[\s\S]*?<!--DIVISION6_END-->/g, '');
    }

    const division7 = this.signatureForm.value.division7;
    if (!division7) {
      content = content.replace(/<!--DIVISION7_START-->[\s\S]*?<!--DIVISION7_END-->/g, '');
    }

    const division8 = this.signatureForm.value.division8;
    if (!division8) {
      content = content.replace(/<!--DIVISION8_START-->[\s\S]*?<!--DIVISION8_END-->/g, '');
    }

    const division9 = this.signatureForm.value.division9;
    if (!division9) {
      content = content.replace(/<!--DIVISION9_START-->[\s\S]*?<!--DIVISION9_END-->/g, '');
    }

    const division10 = this.signatureForm.value.division10;
    if (!division10) {
      content = content.replace(/<!--DIVISION10_START-->[\s\S]*?<!--DIVISION10_END-->/g, '');
    }

    // Předpokládejme, že již máte base64Image, imageWidth a imageHeight nastaveny
    if (this.base64ImageBanner && this.imageWidthBanner && this.imageHeightBanner) {
      content = content.replace('{{imageSrcBanner}}', this.base64ImageBanner);
      content = content.replace('{{imageWidthBanner}}', this.imageWidthBanner.toString());
      content = content.replace('{{imageHeightBanner}}', this.imageHeightBanner.toString());
    }

    const fileBanner = this.base64ImageBanner;
    if (!fileBanner) {
      content = content.replace(/<!--BANNER_START-->[\s\S]*?<!--BANNER_END-->/g, '');
    }

    return content;
  }

// Metoda pro formátování telefonního čísla
  formatPhoneNumber(number: string): string {
    if (!number) return '';
    // Odstranění všech mezer a formátování čísla
    const cleanNumber = number.replace(/\s+/g, '');
    return cleanNumber.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  }

  private exportAsHtmlFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

}
