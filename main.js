// content.js のデータを読み、各セクションを描画する。編集は不要です。
(function () {
  "use strict";

  var PLACEHOLDER_ID = /^X+$/;

  function $(sel) { return document.querySelector(sel); }

  function el(tag, opts, children) {
    var node = document.createElement(tag);
    opts = opts || {};
    if (opts.className) node.className = opts.className;
    if (opts.text) node.textContent = opts.text;
    if (opts.attrs) {
      Object.keys(opts.attrs).forEach(function (k) { node.setAttribute(k, opts.attrs[k]); });
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function setText(sel, value) {
    var node = $(sel);
    if (node) node.textContent = value;
  }

  function fillList(sel, items, itemClass) {
    var list = $(sel);
    if (!list) return;
    items.forEach(function (t) { list.appendChild(el("li", { text: t, className: itemClass })); });
  }

  // ---------- 共通 ----------
  document.querySelectorAll("[data-site]").forEach(function (n) {
    n.textContent = SITE[n.getAttribute("data-site")];
  });
  setText("#year", String(new Date().getFullYear()));
  var repo = $("#repo-link");
  if (repo) repo.href = SITE.githubRepoUrl;

  // ---------- YouTube 軽量埋め込み ----------
  function videoBlock(work) {
    var box = el("div", { className: "video" });
    if (!work.youtubeId || PLACEHOLDER_ID.test(work.youtubeId)) {
      box.classList.add("video-empty");
      box.appendChild(el("p", { text: "動画は準備中です" }));
      return box;
    }
    var btn = el("button", {
      className: "video-play",
      attrs: { type: "button", "aria-label": "「" + work.title + "」を再生する" },
    });
    var img = el("img", {
      attrs: {
        src: "https://i.ytimg.com/vi/" + work.youtubeId + "/hqdefault.jpg",
        alt: work.title + " のサムネイル",
        loading: "lazy",
      },
    });
    btn.appendChild(img);
    btn.appendChild(el("span", { className: "play-icon", attrs: { "aria-hidden": "true" } }));
    btn.addEventListener("click", function () {
      var frame = el("iframe", {
        attrs: {
          src: "https://www.youtube-nocookie.com/embed/" + work.youtubeId + "?autoplay=1&rel=0",
          title: work.title,
          allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
          allowfullscreen: "",
        },
      });
      box.replaceChild(frame, btn);
    });
    box.appendChild(btn);
    return box;
  }

  // ---------- 作品 ----------
  var works = (typeof WORKS !== "undefined" ? WORKS : []).filter(function (w) { return w.published; });
  var heroWork = works.filter(function (w) { return w.featured; })[0] || null;
  var heroSlot = $("#hero-work");
  var worksList = $("#works-list");

  function metaLine(work) {
    var parts = [work.type, work.duration].filter(Boolean);
    return parts.join("　");
  }

  function detailRow(label, valueNode) {
    return el("div", { className: "row" }, [
      el("dt", { text: label }),
      el("dd", {}, [valueNode]),
    ]);
  }

  function workArticle(work, withVideo) {
    var art = el("article", { className: "work" });
    if (withVideo) art.appendChild(videoBlock(work));
    var body = el("div", { className: "work-body wrap" });
    body.appendChild(el("h3", { className: "work-title", text: work.title }));
    var meta = metaLine(work);
    if (meta) body.appendChild(el("p", { className: "work-meta", text: meta }));
    var dl = el("dl", { className: "work-details" });
    if (work.purpose) dl.appendChild(detailRow("制作の目的", el("span", { text: work.purpose })));
    if (work.roles && work.roles.length) {
      var roles = el("ul", { className: "tags" });
      work.roles.forEach(function (r) { roles.appendChild(el("li", { text: r })); });
      dl.appendChild(detailRow("担当範囲", roles));
    }
    if (work.tools && work.tools.length) {
      var tools = el("ul", { className: "tags" });
      work.tools.forEach(function (t) { tools.appendChild(el("li", { text: t })); });
      dl.appendChild(detailRow("使用ソフト", tools));
    }
    if (work.highlights) dl.appendChild(detailRow("工夫した点", el("span", { text: work.highlights })));
    body.appendChild(dl);
    art.appendChild(body);
    return art;
  }

  if (heroSlot) {
    if (heroWork) heroSlot.appendChild(videoBlock(heroWork));
    else heroSlot.remove();
  }

  if (worksList) {
    if (!works.length) {
      worksList.appendChild(el("div", { className: "wrap" }, [
        el("p", { className: "empty", text: "作品は準備中です。お問い合わせからサンプルをお送りできます" }),
      ]));
    } else {
      works.forEach(function (w) {
        // 代表作品の動画はファーストビューに出しているので、ここでは説明のみ
        worksList.appendChild(workArticle(w, !(heroSlot && w === heroWork)));
      });
    }
  }

  // ---------- 短いサンプル ----------
  var samples = (typeof SAMPLES !== "undefined" ? SAMPLES : []).filter(function (s) { return s.published; });
  var samplesBlock = $("#samples-block");
  if (samplesBlock && samples.length) {
    var samplesList = $("#samples-list");
    samples.forEach(function (s) {
      var item = el("figure", { className: "sample" }, [
        videoBlock(s),
        el("figcaption", {}, [
          el("strong", { text: s.title }),
          s.note ? el("span", { text: s.note }) : null,
        ]),
      ]);
      samplesList.appendChild(item);
    });
    samplesBlock.hidden = false;
  }

  // ---------- プロフィール・ご依頼 ----------
  if (typeof PROFILE !== "undefined") {
    setText("#profile-intro", PROFILE.intro);
    setText("#profile-origin", PROFILE.origin);
    fillList("#profile-tools", PROFILE.tools);
  }
  if (typeof SERVICES !== "undefined") {
    fillList("#services-types", SERVICES.types);
    fillList("#services-flow", SERVICES.flow);
    setText("#services-schedule", SERVICES.schedule);
    var faqBlock = $("#services-faq-block");
    if (faqBlock && SERVICES.faq && SERVICES.faq.length) {
      var faq = $("#services-faq");
      SERVICES.faq.forEach(function (item) {
        faq.appendChild(el("div", { className: "faq-item" }, [
          el("dt", { text: item.q }),
          el("dd", { text: item.a }),
        ]));
      });
      faqBlock.hidden = false;
    }
  }

  // ---------- このサイトについて ----------
  if (typeof ABOUT_THIS_SITE !== "undefined") {
    setText("#about-purpose", ABOUT_THIS_SITE.purpose);
    setText("#about-tech", ABOUT_THIS_SITE.tech);
    setText("#about-process", ABOUT_THIS_SITE.process);
    setText("#about-next", ABOUT_THIS_SITE.nextSteps);
  }

  // ---------- スマホのメニュー ----------
  var menuBtn = $(".menu-button");
  var nav = $("#global-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---------- お問い合わせフォーム ----------
  var form = $("#contact-form");
  if (form) {
    var status = $("#form-status");
    var submit = $("#f-submit");
    var notConfigured = !SITE.formspreeEndpoint || /\/f\/X+$/.test(SITE.formspreeEndpoint);

    function showStatus(msg, kind) {
      status.textContent = msg;
      status.className = "form-status " + (kind || "");
    }

    if (notConfigured) {
      submit.disabled = true;
      showStatus("フォームはまだ準備中です。送信先が設定されていないため、現在は送信できません。", "is-error");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (notConfigured) return;

      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();
      if (!name || !email || !message) {
        showStatus("お名前、メールアドレス、内容はすべて入力してください。", "is-error");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStatus("メールアドレスの形式が正しくないようです。入力内容を確認してください。", "is-error");
        return;
      }

      submit.disabled = true;
      showStatus("送信中です…", "");
      fetch(SITE.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          showStatus("送信しました。2日以内にご返信します", "is-success");
        } else {
          throw new Error("status " + res.status);
        }
      }).catch(function () {
        showStatus("送信できませんでした。通信状況を確認して、もう一度お試しください。それでも届かない場合は、時間をおいてから再度お送りください。", "is-error");
      }).then(function () {
        submit.disabled = false;
      });
    });
  }
})();
