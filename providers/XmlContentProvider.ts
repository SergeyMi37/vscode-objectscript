import * as vscode from 'vscode';
import { AtelierAPI } from './../api';

import { OBJECTSCRIPTXML_FILE_SCHEMA } from '../extension';
import { TextDecoder } from 'util';

export class XmlContentProvider implements vscode.TextDocumentContentProvider {
  private _api: AtelierAPI;
  private onDidChangeEvent: vscode.EventEmitter<vscode.Uri> = new vscode.EventEmitter<vscode.Uri>();

  constructor() {
    this._api = new AtelierAPI();
  }

  provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
    // uri.query.
    return vscode.workspace
      .openTextDocument(vscode.Uri.file(uri.fragment))
      .then(document => document.getText())
      .then(text => this._api.cvtXmlUdl(text))
      .then(data => data.result.content[0].content.join('\n'));
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this.onDidChangeEvent.event;
  }

  public update(uri: vscode.Uri, message?: string): void {
    this.onDidChangeEvent.fire(uri);
  }
}
