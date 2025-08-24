use chrono::NaiveDate;
use pulldown_cmark::{html, Parser};
use serde::Deserialize;
use wasm_bindgen::prelude::*;
use serde_wasm_bindgen;

#[derive(Deserialize, Debug, serde::Serialize)]
struct Frontmatter {
    #[serde(rename = "Date")]
    date: NaiveDate,
    #[serde(rename = "Title")]
    title: String,
    #[serde(rename = "Tags")]
    tags: Vec<String>,
}

#[wasm_bindgen]
pub struct MarkdownOutput {
    frontmatter: JsValue,
    html: String,
}

#[wasm_bindgen]
impl MarkdownOutput {
    #[wasm_bindgen(getter)]
    pub fn frontmatter(&self) -> JsValue {
        self.frontmatter.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn html(&self) -> String {
        self.html.clone()
    }
}

#[wasm_bindgen]
pub fn markdown_to_html(markdown: &str) -> Result<MarkdownOutput, JsValue> {
    let (frontmatter, content) = if markdown.starts_with("---") {
        let end_of_frontmatter = markdown[3..].find("---").map(|i| i + 3);
        if let Some(end_of_frontmatter) = end_of_frontmatter {
            let frontmatter_str = &markdown[3..end_of_frontmatter];
            let content = &markdown[end_of_frontmatter + 3..];
            (Some(frontmatter_str), content)
        } else {
            (None, markdown)
        }
    } else {
        (None, markdown)
    };

    let frontmatter_js = if let Some(frontmatter_str) = frontmatter {
        let parsed_frontmatter: Frontmatter = serde_yaml::from_str(frontmatter_str)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        serde_wasm_bindgen::to_value(&parsed_frontmatter)
            .map_err(|e| JsValue::from_str(&e.to_string()))?
    } else {
        JsValue::NULL
    };

    let parser = Parser::new(content);
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);

    Ok(MarkdownOutput {
        frontmatter: frontmatter_js,
        html: html_output,
    })
}
