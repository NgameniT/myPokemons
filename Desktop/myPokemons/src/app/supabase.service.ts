import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "../environments/environment";

// Service central qui crée et expose le client Supabase
// Un seul client partagé dans toute l'application (singleton via providedIn: 'root')

@Injectable({ providedIn: 'root' })
export class SupabaseService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}
