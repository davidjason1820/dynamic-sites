import type { Resource } from './data'

/**
 * Verified video files from the public xiiiabu/motionsites.ai repository.
 * Base: https://raw.githubusercontent.com/xiiiabu/motionsites.ai/main/assets/videos/
 *
 * Exactly 58 of the 65 prompts have verified video previews in the repository.
 * The remaining 7 prompts use a clearly labeled "Concept preview" fallback.
 */
export const motionSitesVideos: Record<string, string> = {
  'AI Designer Agency': 'AI_Designer_Agency_0.mp4',
  'AKOR Security': 'AKOR_Security_0.mp4',
  'ClubX Investors': 'ClubX_Investors_0.mp4',
  'CodeNest Coding Platform': 'CodeNest_Coding_Platform_0.mp4',
  'Liquid Glass Agency': 'Liquid_Glass_Agency_0.mp4',
  'Mindloop Landing': 'Mindloop_Landing_0.mp4',
  'NeoVision': 'NeoVision_0.mp4',
  'NOVA Space Systems': 'NOVA_Space_Systems_1.mp4',
  'Orbis NFT': 'Orbis_NFT_0.mp4',
  'SkyElite Private Jets': 'SkyElite_Private_Jets_0.mp4',
  'Space Voyage': 'Space_Voyage_0.mp4',
  'Weblex Dark Hero': 'Weblex_Dark_Hero_0.mp4',
  'AI Automation Hero': 'AI_Automation_Hero_0.mp4',
  'Apex SaaS': 'Apex_SaaS_0.mp4',
  'Bionova Biotech': 'Bionova_Biotech_0.mp4',
  'ClearInvoice SaaS Hero': 'ClearInvoice_SaaS_Hero_0.mp4',
  'Datacore Booking': 'Datacore_Booking_0.mp4',
  'Datacore SaaS Hero': 'Datacore_SaaS_Hero_0.mp4',
  'Digitwist AI Builder': 'Digitwist_AI_Builder_0.mp4',
  'Finlytic AI Agent': 'Finlytic_AI_Agent_0.mp4',
  'Grow AI Talent Platform': 'Grow_AI_Talent_Platform_0.mp4',
  'HR SaaS Hero': 'HR_SaaS_Hero_0.mp4',
  'Mindloop SaaS': 'Mindloop_0.mp4',
  'Neuralyn SaaS': 'Neuralyn_0.mp4',
  'Nexora Automation': 'Nexora_Automation_0.mp4',
  'Nickel Payments': 'Nickel_Payments_0.mp4',
  'Planet Orbit SaaS': 'Planet_Orbit_0.mp4',
  'Synapse Dark Hero': 'Synapse_Dark_Hero_0.mp4',
  'Targo Logistics Hero': 'Targo_Logistics_Hero_0.mp4',
  'Taskora SaaS Hero': 'Taskora_SaaS_Hero_0.mp4',
  'Terra Geo Map': 'Terra_Geo_Map_0.mp4',
  'Aethera Studio': 'Aethera_Studio_0.mp4',
  'Asme': 'Asme_0.mp4',
  'Bloom AI': 'Bloom_AI_0.mp4',
  'DesignPro Academy': 'DesignPro_Academy_0.mp4',
  'EVR Ventures': 'EVR_Ventures_0.mp4',
  'Nexus IT Solutions': 'Nexus_IT_Solutions_0.mp4',
  'Power AI': 'Power_AI_0.mp4',
  'Railroad.ai': 'Railroad.ai_0.mp4',
  'Stellar AI': 'Stellar_AI_0.mp4',
  'Sync AI': 'Sync_AI_0.mp4',
  'Taskly': 'Taskly_0.webm',
  'Transform Data': 'Transform_Data_0.mp4',
  'xPortfolio Hero': 'xPortfolio_Hero_0.mp4',
  'New Era Automotive Hero': 'New_Era_Automotive_Hero_0.mp4',
  'Orbit Web3': 'Orbit_Web3_0.mp4',
  'Web3 EOS Hero': 'Web3_EOS_Hero_0.mp4',
  'Buzzentic Agency': 'Buzzentic_Agency_0.mp4',
  'New Era Bold Hero': 'New_Era_Bold_Hero_0.mp4',
  'Framelix 3D Studios': 'Framelix_3D_Studios_0.mp4',
  'Logoisum Video Agency': 'Logoisum_Video_Agency_0.mp4',
  'Orbit Engineers': 'Orbit_Engineers_0.mp4',
  'Velorah Agency': 'Velorah_0.mp4',
  'Wealth Video Hero': 'Wealth_Video_Hero_0.mp4',
  'Investor Deck': 'Investor_Deck_0.mp4',
  'Dark Portfolio Hero': 'Dark_Portfolio_Hero_0.mp4',
  'Portfolio Cosmic': 'Portfolio_Cosmic_0.mp4',
  'Viktor Portfolio': 'Viktor_Portfolio_0.mp4',
}

export const VIDEO_BASE_URL = 'https://raw.githubusercontent.com/xiiiabu/motionsites.ai/main/assets/videos/'

/**
 * Attaches verified preview video URLs to resource records.
 */
export function attachVideoPreviews(resources: Resource[]): Resource[] {
  return resources.map((resource) => {
    const filename = motionSitesVideos[resource.title]
    if (filename) {
      const sanitized = encodeURIComponent(filename).replace(/%2F/g, '/')
      return {
        ...resource,
        previewVideoUrl: `${VIDEO_BASE_URL}${sanitized}`,
      }
    }
    return resource
  })
}
